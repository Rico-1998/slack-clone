import { ChangeDetectionStrategy, Injectable } from '@angular/core';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { query, Timestamp } from '@firebase/firestore';
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
  loading: boolean = false;
  chatLoading: boolean = false;
  threadOpen: boolean = false;
  threadComments: any[] = [];
  thread: any;
  threadMessage: any;
  msgToEdit: object;
  shouldScroll = true;
  unsub: any;


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

  async getChatRoom(chatroomId) {
    this.chatId = chatroomId['id'] || chatroomId;
    this.currentChat = this.chats.filter(a => a.id == this.chatId);
    this.currentChatMembers = this.currentChat[0]?.otherUsers;
    this.currentChatMessages = [];
    const colRef = collection(this.db, 'chats', this.chatId, 'messages');
    const q = query(colRef, orderBy('timestamp', 'asc'))
    this.unsub = onSnapshot(q, async (snapshot) => {
      await this.snapChatroomMessages(snapshot);
    },
    (error) => {
      console.warn('Loading current chatroom error',error);      
    });
  }

  async snapChatroomMessages(snapshot) {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type == 'added') {
        let comments = await getDocs(collection(this.db, 'chats', this.chatId, 'messages', change.doc.id, 'comments'));
        let timestampConvertedMsg = { ...(change.doc.data() as object), id: this.chatId, documentId: change.doc.id, comments: comments.size };
        timestampConvertedMsg['timestamp'] = this.channelService.convertTimestamp(timestampConvertedMsg['timestamp'], 'full');
        this.currentChatMessages.push(timestampConvertedMsg);
      } else if (change.type == 'removed') {
        let indexOfMessageToRemove = this.currentChatMessages.findIndex(m => m.documentId == change.doc.id);
        this.currentChatMessages.splice(indexOfMessageToRemove, 1)
      } else if (change.type == "modified") {
        let messageToEdit = this.currentChatMessages.filter(m => m.documentId == change.doc.id);
        messageToEdit[0]['msg'] = change.doc.data()['msg'];
        messageToEdit[0]['edit'] = change.doc.data()['edit'];
      }
      this.chatLoading = false;
      this.shouldScroll = true;
    })
    setTimeout(() => {
      if(this.currentChatMessages.length < 1) {
        this.chatLoading = false;
      }
    }, 500);
  }

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

  spliceUser(index) {
    this.selectedUserList.splice(index, 1);
  }

  createRoomId() {
    let roomId = [this.userService.currentUser.id];
    this.selectedUserList.forEach((user) => {
      roomId.push(user.id);
    })
    return roomId;
  }

  saveMsg(roomId) { // Bei add vergibt firebase automatisch eine id
    let timestamp = Timestamp.fromDate(new Date());
    addDoc(collection(this.db, 'chats', roomId, 'messages'), {
      timestamp: timestamp,
      author: this.userService.currentUser.userName,
      msg: this.chatMsg,
      edit: false,
    })

  }

  setChatRoom(roomId) { //bei set muss man die id selbst angeben 
    setDoc(doc(this.db, 'chats', roomId), {
      userIds: this.createRoomId(),
    });
  }


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

  async getChats() {
    onSnapshot(this.currentUserChats, async (snapshot) => {
      this.snapChatMembers(snapshot);
    },
    (error) => {
      console.warn('Loading all chats error',error);      
    });
  }


  async snapChatMembers(snapshot) {
    snapshot.docs.forEach((doc) => {
      if (!this.chats.find(a => a.id == doc.id)) {
        let otherUsers = (doc.data()['userIds'].filter(a => a != this.currentUser.uid));
        let currentUser = (doc.data()['userIds'].filter(a => a == this.currentUser.uid));
        if (otherUsers.length == 0) {
          const toFindDuplicates = currentUser => currentUser.filter((item, index) => currentUser.indexOf(item) !== index);
          this.chats.push(({ ...(doc.data() as object), id: doc.id, otherUsers: toFindDuplicates(currentUser) }));
        } else {
          this.chats.push(({ ...(doc.data() as object), id: doc.id, otherUsers: otherUsers }));
        }
        this.findOtherUsers();
      }
    });
    this.getLastVisitsForChats();

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
      console.warn('Setting last visit to chat error',error);      
    })
  }

  async findOtherUsers() {
    for (let i = 0; i < this.chats.length; i++) {
      let otherUsers = this.chats[i]?.otherUsers;
      for (let i = 0; i < otherUsers.length; i++) {
        let actualMember = otherUsers[i];
        getDoc(doc(this.db, 'users', actualMember))
          .then((docData) => {
            let index = otherUsers.indexOf(actualMember);
            otherUsers[index] = docData.data();
          })
      }
    }
  }

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
        setTimeout(() => {
          this.updateLastVisitTimestamp();
        }, 1000);
      });
    this.shouldScroll = true;
  }

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
      console.warn('Loading comments to thread (chat) error',error);      
    })
  }

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

  async editMsg(msg) {   
    console.log(this.msgToEdit);     
    let docToUpdate = doc(this.db, 'chats', this.msgToEdit['id'], 'messages', this.msgToEdit['documentId']);
    await updateDoc(docToUpdate, {
      msg: msg,
      edit: true,
    });
    this.msgToEdit = [];
  }

  arrayToString(array) {
    return array.sort().join('');
  }

  //* Updates the time when last message was send in chats */
  async updateLastMessageTimestamp(timestamp) {
    await updateDoc(doc(this.db, 'chats', this.chatId), {
      lastMessage: timestamp
    })
  }

  //* Updates the timestap when user last visited the chat*/
  async updateLastVisitTimestamp() {
    const docToUpdate = doc(this.db, 'users', JSON.parse(localStorage.getItem('user')).uid, 'lastChatVisits', this.chatId);
    await setDoc(docToUpdate, {
      time: Timestamp.fromDate(new Date())
    });
  }
}

