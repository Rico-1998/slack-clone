import { Injectable, OnDestroy } from '@angular/core';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { query, Timestamp } from '@firebase/firestore';
import { ChannelService } from './channel.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
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
  threadOpen: boolean = false;
  threadComments: any[] = [];
  thread: any;
  threadMessage: any;
  msgToEdit: object;
  shouldScroll = true;



  constructor(public userService: UserService,
    public route: ActivatedRoute,
    public router: Router,
    public channelService: ChannelService,
  ) {
  }

  ngOnDestroy() {
    
  }

  async getChatRoom(chatroomId) {
    this.chatId = chatroomId['id'] || chatroomId;
    this.currentChat = this.chats.filter(a => a.id == this.chatId);
    this.currentChatMembers = this.currentChat[0]?.otherUsers;
    const colRef = collection(this.db, 'chats', this.chatId, 'messages');
    const q = query(colRef, orderBy('timestamp', 'asc'))
    const unsub = onSnapshot(q, async (snapshot) => {
      if(this.chatId != this.currentChat[0]?.id) {        
        unsub();
      } else {
        await this.snapChatroomMessages(snapshot);
      };
    });    
  }

  async snapChatroomMessages(snapshot) {
    this.currentChatMessages = []; 
    snapshot.docs.forEach(async (document) => {
      if (!this.currentChatMessages.find(m => m.id == document.id)) {
      let comments = await getDocs(collection(this.db, 'chats', this.chatId, 'messages', document.id, 'comments'));
      let timestampConvertedMsg = await { ...(document.data() as object), id: this.chatId, documentId: document.id, comments: comments.size };
      timestampConvertedMsg['timestamp'] = this.channelService.convertTimestamp(timestampConvertedMsg['timestamp'], 'full');
      this.currentChatMessages.push(timestampConvertedMsg);
      // console.log(document.id)
    }
      this.shouldScroll = true;      
    });
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
    })
    
  }

  setChatRoom(roomId) { //bei set muss man die id selbst angeben 
    setDoc(doc(this.db, 'chats', roomId), {
      userIds: this.createRoomId(),
    });
  }


  async createChatRoom() {
    // this.foundedUsers = [];    
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
      this.chats = [];
      await this.snapChatMembers(snapshot);
      await this.findOtherUsers();
    });
  }


  async snapChatMembers(snapshot) {
    snapshot.docs.forEach((doc) => {
      let otherUsers = (doc.data()['userIds'].filter(a => a != this.currentUser.uid));
      let currentUser = (doc.data()['userIds'].filter(a => a == this.currentUser.uid));
      if (otherUsers.length == 0) {
        const toFindDuplicates = currentUser => currentUser.filter((item, index) => currentUser.indexOf(item) !== index);
        this.chats.push(({ ...(doc.data() as object), id: doc.id, otherUsers: toFindDuplicates(currentUser) }));
      } else {
        this.chats.push(({ ...(doc.data() as object), id: doc.id, otherUsers: otherUsers }));
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
    })
  }

  async findOtherUsers() {
    for (let i = 0; i < this.chats.length; i++) {
      let otherUsers = this.chats[i]?.otherUsers;
      for (let i = 0; i < otherUsers.length; i++) {
        let actualMember = otherUsers[i];
        await getDoc(doc(this.db, 'users', actualMember))
          .then((docData) => {
            let index = otherUsers.indexOf(actualMember);
            otherUsers[index] = docData.data();
          })
      }
    }
  }

  addMessage() {
    let colRef = collection(this.db, 'chats', this.currentChatMessages[0].id, 'messages');
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
      console.log(this.chatId)
    });; 
    this.shouldScroll = true;
  }

  async getCurrentThread() {
    this.threadComments = [];
    let colRef = query(collection(this.db, 'chats', this.currentChatMessages[0].id, 'messages', this.thread.documentId, 'comments'), orderBy('timestamp'))
    await onSnapshot(colRef, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (!this.threadComments.find(c => c.id == doc.id)) {
          let timestampConvertedMsg = { ...(doc.data() as object), id: doc.id };
          timestampConvertedMsg['timestamp'] = this.channelService.convertTimestamp(timestampConvertedMsg['timestamp'], 'full');
          this.threadComments.push(timestampConvertedMsg)
        }
      })
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
    let docToUpdate = doc(this.db, 'chats', this.msgToEdit['id'], 'messages', this.msgToEdit['documentId']);
    await updateDoc(docToUpdate, {
      msg: msg
    });
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

