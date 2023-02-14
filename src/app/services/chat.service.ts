import { ChangeDetectionStrategy, Injectable } from '@angular/core';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { query, Timestamp } from '@firebase/firestore';
import { catchError } from 'rxjs';
import { ChannelService } from './channel.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  visibleTextEditor: boolean = false;
  selectedUserList = [];
  foundedUsers: any[] = [];
  db = getFirestore();
  chatsRef = collection(this.db, 'chats');
  chatMsg = [];
  chats: any[] = [];
  currentUser = JSON.parse(localStorage.getItem('user'));
  currentUserChats = query(collection(this.db, 'chats'), where('userIds', 'array-contains', this.currentUser.uid));
  chatId: any;
  currentChat: any;
  currentChatMembers: any;
  currentChatMessages = [];
  currentFilteredMessages = [];
  loading: boolean = false;
  chatLoading: boolean = false;
  threadOpen: boolean = false;
  threadComments: any[] = [];
  thread: any;
  threadMessage: any;
  msgToEdit: object;
  shouldScroll = true;
  showEditor = false;
  unsub: any;
  filteredValue: any;


  constructor(public userService: UserService,
    public route: ActivatedRoute,
    public router: Router,
    public channelService: ChannelService,
  ) {
  }


  destroy() {
    if (this.unsub) {
      this.unsub();
    }
  }


  //**get current chatroom to load messages inside */
  async getChatRoom(chatroomId) {
    this.currentChatMessages = [];
    this.currentFilteredMessages = [];
    this.chatId = chatroomId['id'] || chatroomId;
    this.currentChat = this.chats.filter(a => a.id == this.chatId);
    this.currentChatMembers = this.currentChat[0]?.otherUsers;
    const colRef = collection(this.db, 'chats', this.chatId, 'messages');
    const q = query(colRef, orderBy('timestamp', 'asc'))
    this.unsub = onSnapshot(q, async (snapshot) => {
      await this.snapChatroomMessages(snapshot);
    },
      (error) => {
        console.warn('Loading current chatroom error', error);
      });
  }


  //**update messages in chat when new message written by any user in this chat */
  async snapChatroomMessages(snapshot) {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type == 'added') {
       this.addSnapMessage(change);
      } else if (change.type == 'removed') {
        this.removeSnapMessage(change);
      } else if (change.type == "modified") {
        this.modifySnapMessage(change);
      }
      this.chatLoading = false;
      this.shouldScroll = true;
    })
    setTimeout(() => {
      if (this.currentChatMessages.length < 1) {
        this.chatLoading = false;
      }
    }, 500);
  }


  //**finds and modifies the snapped messages */
  modifySnapMessage(change) {
    let messageToEdit = this.currentChatMessages.filter(m => m.documentId == change.doc.id);
    let messageToEditFiltered = this.currentFilteredMessages.filter(m => m.documentId == change.doc.id);
    messageToEdit[0]['msg'] = change.doc.data()['msg'];
    messageToEdit[0]['edit'] = change.doc.data()['edit'];
    messageToEditFiltered[0]['msg'] = change.doc.data()['msg'];
    messageToEditFiltered[0]['edit'] = change.doc.data()['edit'];
  }


  //**finds and removes the snapped messages */
  removeSnapMessage(change) {
    let indexOfMessageToRemove = this.currentChatMessages.findIndex(m => m.documentId == change.doc.id);
        let indexOfFilteredMessageToRemove = this.currentFilteredMessages.findIndex(m => m.documentId == change.doc.id);
        this.currentChatMessages.splice(indexOfMessageToRemove, 1)
        this.currentFilteredMessages.splice(indexOfFilteredMessageToRemove, 1)
  }


  //**add the snapped messages to the chat */
  async addSnapMessage(change) {
    let comments = await getDocs(collection(this.db, 'chats', this.chatId, 'messages', change.doc.id, 'comments'));
    let timestampConvertedMsg = { ...(change.doc.data() as object), id: this.chatId, documentId: change.doc.id, comments: comments.size };
    timestampConvertedMsg['timestamp'] = this.channelService.convertTimestamp(timestampConvertedMsg['timestamp'], 'full');
    this.currentChatMessages.push(timestampConvertedMsg);
    this.currentFilteredMessages.push(timestampConvertedMsg);
  }


  //**add user to current chat if not allready in */
  setToChatList(user) {
    if (!this.selectedUserList.includes(user) && this.selectedUserList.length <= 2) {
      this.selectedUserList.push(user);
      this.visibleTextEditor = true;
    } else if (this.selectedUserList.includes(user)) {
      alert('nutzer existiert bereits')
    } else if (this.selectedUserList.length == 2) {
      alert('maximum an teilnehmern erreicht')
    } else if (this.selectedUserList.length == 0) {
      this.visibleTextEditor = false;
    }
  }


  //**delete user from chat */
  spliceUser(index) {
    this.selectedUserList.splice(index, 1);
  }


  //**put user ID´s in roomId array */
  createRoomId() {
    let roomId = [this.userService.currentUser.id];
    this.selectedUserList.forEach((user) => {
      roomId.push(user.id);
    })
    return roomId;
  }


  //**add message to current chat and collection in firebase */
  saveMsg(roomId) {
    let timestamp = Timestamp.fromDate(new Date());
    addDoc(collection(this.db, 'chats', roomId, 'messages'), {
      timestamp: timestamp,
      author: this.userService.currentUser.userName,
      msg: this.chatMsg,
      edit: false,
    })

  }


  //**sets chat-ID = value of roomId */
  setChatRoom(roomId) {
    setDoc(doc(this.db, 'chats', roomId), {
      userIds: this.createRoomId(),
    });
  }


  //**checkes if a chatroom already exists, if not creates a new chatroom */
  async createChatRoom() {
    let roomId = this.arrayToString(this.createRoomId());
    let chatRoomExists = getDoc(doc(this.db, 'chats', roomId));
    if (!((await chatRoomExists).data())) {
      this.setChatRoom(roomId);
      this.saveMsg(roomId);
      this.router.navigate(['/home/chatroom/' + roomId])
    } else {
      this.saveMsg(roomId);
      this.router.navigate(['/home/chatroom/' + roomId])
    }
    this.shouldScroll = true;
  }


  //**gets the chat from backend */
  async getChats() {
    onSnapshot(this.currentUserChats, async (snapshot) => {
      this.snapChatMembers(snapshot);
    },
      (error) => {
        console.warn('Loading all chats error', error);
      });
  }


  //**finds and sorts all chatmembers and handles data change */
  async snapChatMembers(snapshot) {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type == 'added') {
        let otherUsers = (change.doc.data()['userIds'].filter(a => a != this.currentUser.uid));
        let currentUser = (change.doc.data()['userIds'].filter(a => a == this.currentUser.uid));
        if (otherUsers.length == 0) {
          this.findCurrentUser(currentUser, change)
        } else {
          this.findOtherUser(otherUsers, change)
        }
      } else if (change.type == 'modified') {
        let chatToUpdate = this.chats.filter((chat) => chat.id == change.doc.id,'snap');
        chatToUpdate[0].lastMessage = change.doc.data().lastMessage;
      }
    });
    this.getLastVisitsForChats();
  }


  //**finds the current user and pushes in to chat array on forst place */
  findCurrentUser(currentUser, change) {
    const toFindDuplicates = currentUser => currentUser.filter((item, index) => currentUser.indexOf(item) !== index);
    currentUser = this.userService.users.filter(a => a.id == toFindDuplicates(currentUser));
    this.chats.push(({ ...(change.doc.data() as object), id: change.doc.id, otherUsers: currentUser }));
  }


  //**find other chat users and puishes them in to the chat array */
  findOtherUser(otherUsers, change) {
    otherUsers.forEach(otherUser => {
      otherUser = this.userService.users.find(a => a.id == otherUser);
      let index = otherUsers.indexOf(otherUser['id']);
      if (index != -1) {
        otherUsers[index] = otherUser;
      }
    });
    this.chats.push(({ ...(change.doc.data() as object), id: change.doc.id, otherUsers: otherUsers }));
  }


  //**load and connects the lastVisitTimestamps into the chats */
  async getLastVisitsForChats() {
    onSnapshot(collection(this.db, 'users', JSON.parse(localStorage.getItem('user')).uid, 'lastChatVisits'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        let chat = this.chats.find(c => c.id == doc.id);
        if (chat) {
          chat.lastUserVisit = doc.data();
        }
      })
    },
      (error) => {
        console.warn('Setting last visit to chat error', error);
      })
  }


  //* Updates the timestap when user last visited the chat*/
  async updateLastVisitTimestamp() {
    let currentUserId = await JSON.parse(localStorage.getItem('user')).uid;
    const docToUpdate = doc(this.db, 'users', currentUserId, 'lastChatVisits', this.chatId);
    await setDoc(docToUpdate, {
      time: Timestamp.fromDate(new Date())
    })
      ;
  }


  //**add message to current chat and scroll to last message in chat */
  addMessage() {
    let colRef = collection(this.db, 'chats', this.chatId, 'messages');
    let timestamp = Timestamp.fromDate(new Date());
    addDoc(colRef, {
      timestamp: timestamp,
      author: this.userService.currentUser.userName,
      msg: this.chatMsg
    })
      .then(() => {
        this.updateLastMessageTimestamp(timestamp);
        this.updateLastVisitTimestamp();
      });
    this.shouldScroll = true;
  }


  //**loading current thread */
  async getCurrentThread() {
    this.threadComments = [];
    let colRef = query(collection(this.db, 'chats', this.chatId, 'messages', this.thread.documentId, 'comments'), orderBy('timestamp'))
    onSnapshot(colRef, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (!this.threadComments.find(c => c.id == doc.id)) {
          let timestampConvertedMsg = { ...(doc.data() as object), id: doc.id };
          timestampConvertedMsg['timestamp'] = this.channelService.convertTimestamp(timestampConvertedMsg['timestamp'], 'full');
          this.threadComments.push(timestampConvertedMsg)
        }
      })
    },
      (error) => {
        console.warn('Loading comments to thread (chat) error', error);
      })
  }


  //**loading messages to current thread */
  async loadMessageToThread() {
    this.loading = true;
    let document = doc(this.db, 'chats', this.currentChatMessages[0].id, 'messages', this.thread.documentId);
    await getDoc(document)
      .then((doc) => {
        this.threadMessage = doc.data();
        this.threadMessage['timestamp'] = this.channelService.convertTimestamp(this.threadMessage['timestamp'], 'onlyDate');
        this.loading = false;
      })
  }


  //**add message to current thread */
  msgToChatThread() {
    this.loading = true;
    let timestamp = Timestamp.fromDate(new Date());
    let colRef = collection(this.db, 'chats', this.currentChatMessages[0].id, 'messages', this.thread.documentId, 'comments');
    addDoc(colRef, {
      timestamp: timestamp,
      author: this.userService.currentUser.userName,
      msg: this.chatMsg
    })
      .then(() => {
        this.thread.comment = this.thread['comments']++;
        this.loading = false;
      })
  }


  //**updates the message on backend with the new message text */
  async editMsg(msg) {
    let docToUpdate = doc(this.db, 'chats', this.msgToEdit['id'], 'messages', this.msgToEdit['documentId']);
    await updateDoc(docToUpdate, {
      msg: msg,
      edit: true,
    });
    this.msgToEdit = [];
  }


  //** makes a string out of an array */
  arrayToString(array) {
    return array.sort().join('');
  }


  //* Updates the time when last message was send in chats */
  async updateLastMessageTimestamp(timestamp) {
    await updateDoc(doc(this.db, 'chats', this.chatId), {
      lastMessage: timestamp
    })
  }

  //**handles open thread */
  openThread(message) {
    this.thread = message;
    this.threadOpen = true;
    this.getCurrentThread();
    this.loadMessageToThread();
  }

  //**puts message in quill editor to edit it*/
  changePath(message) {
    this.msgToEdit = message;
    setTimeout(() => {
      let quillEditorTextfield = document.querySelectorAll('.ql-editor');
      quillEditorTextfield[0].innerHTML = message.msg;
      quillEditorTextfield
    });

  }
}

