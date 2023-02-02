import { Injectable, OnDestroy } from '@angular/core';
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, orderBy, setDoc, updateDoc, where } from '@angular/fire/firestore';
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
    addDoc(collection(this.db, 'chats', roomId, 'messages'), {
      timestamp: Timestamp.fromDate(new Date()),
      author: this.userService.currentUser.userName,
      msg: this.chatMsg,
    });
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
    addDoc(colRef, {
      timestamp: Timestamp.fromDate(new Date()),
      author: this.userService.currentUser.userName,
      msg: this.chatMsg
    }); 
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
    let colRef = collection(this.db, 'chats', this.currentChatMessages[0].id, 'messages', this.thread.documentId, 'comments');
    addDoc(colRef, {
      timestamp: Timestamp.fromDate(new Date()),
      author: this.userService.currentUser.userName,
      msg: this.chatMsg
    });
    this.loading = false;
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
}

