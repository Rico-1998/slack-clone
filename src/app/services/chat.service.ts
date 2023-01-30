import { IfStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, orderBy, setDoc, updateDoc, where } from '@angular/fire/firestore';
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
  currentChat: any;
  currentChatMembers: any;
  currentchatMessages = [];
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

  setToChatList(user) {
    // this.selectedUserList.push(this.userService.currentUser);
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

  arrayToString(array) {
    return array.sort().join('');
  }


  async loadChat() {
    // const docSnap = getDoc(doc(this.db, 'chats', this.arrayToString(this.createRoomId()) , 'messages'));
    const docRef = doc(this.db, 'chats', this.arrayToString(this.createRoomId()), 'messages');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  saveMsg(roomId) { // Bei add vergibt firebase automatisch eine id
    addDoc(collection(this.db, 'chats', roomId, 'messages'), {
      timestamp: Timestamp.fromDate(new Date()),
      author: this.userService.currentUser.userName,
      msg: this.chatMsg,
    })
      .then(() => {
        alert('Message added!')
      });
  }

  setChatRoom(roomId) { //bei set muss man die id selbst angeben 
    setDoc(doc(this.db, 'chats', roomId), {
      userIds: this.createRoomId(),
    })
      .then(() => {
        alert('Chat created!')
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

  getChats() {
    onSnapshot(this.currentUserChats, async (snapshot) => {
      this.chats = [];
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
      this.findOtherUsers();
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

  getChatRoom(chatroomId) {
    let chatId = chatroomId['id'];
    this.currentChat = this.chats.filter(a => a.id == chatId);
    this.currentChatMembers = this.currentChat[0]?.otherUsers;
    let colRef = query(collection(this.db, 'chats', chatroomId['id'], 'messages'), orderBy('timestamp', 'asc'));
    onSnapshot(colRef, async (snapshot) => {
      this.currentchatMessages = [];
      snapshot.docs.forEach((document) => {
        let timestampConvertedMsg = { ...(document.data() as object), id: chatroomId, documentId: document.id };
        timestampConvertedMsg['timestamp'] = this.channelService.convertTimestamp(timestampConvertedMsg['timestamp'], 'full');
        this.currentchatMessages.push(timestampConvertedMsg)
      });
    });
    this.shouldScroll = true;
  }

  addMessage() {
    let colRef = collection(this.db, 'chats', this.currentchatMessages[0].id.id, 'messages');
    addDoc(colRef, {
      timestamp: Timestamp.fromDate(new Date()),
      author: this.userService.currentUser.userName,
      msg: this.chatMsg
    });
    this.shouldScroll = true;
  }

  async getCurrentThread() {
    this.threadComments = [];
    let colRef = query(collection(this.db, 'chats', this.currentchatMessages[0].id.id, 'messages', this.thread.documentId, 'comments'), orderBy('timestamp'))
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
    let document = doc(this.db, 'chats', this.currentchatMessages[0].id.id, 'messages', this.thread.documentId);
    await getDoc(document)
      .then((doc) => {
        this.threadMessage = doc.data();
        this.threadMessage['timestamp'] = this.channelService.convertTimestamp(this.threadMessage['timestamp'], 'onlyDate');
        this.loading = false;
      })
  }

  msgToChatThread() {
    this.loading = true;
    let colRef = collection(this.db, 'chats', this.currentchatMessages[0].id.id, 'messages', this.thread.documentId, 'comments');
    addDoc(colRef, {
      timestamp: Timestamp.fromDate(new Date()),
      author: this.userService.currentUser.userName,
      msg: this.chatMsg
    });
    this.loading = false;
  }

  async editMsg(msg) {
    let docToUpdate = doc(this.db, 'chats', this.msgToEdit['id']['id'], 'messages', this.msgToEdit['documentId']);
    await updateDoc(docToUpdate, {
      msg: msg
    })
  }

}

