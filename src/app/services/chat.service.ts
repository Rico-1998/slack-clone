import { IfStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, orderBy, setDoc, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { query, Timestamp } from '@firebase/firestore';
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

  constructor(public userService: UserService,
    public route: ActivatedRoute,
    public router: Router) {
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
    // interface chatMessage erstellen mit (timestamp, author, msg)
    // value aus dem texteditor holen
    // format chatMsg bearbeiten (siehe andere Gruppe)
  }

  getChats() {
    onSnapshot(this.currentUserChats, async (snapshot) => {
      this.chats = [];
      snapshot.docs.forEach((doc) => {
        let otherUsers = (doc.data()['userIds'].filter(a => a != this.currentUser.uid));
        let currentUser = (doc.data()['userIds'].filter(a => a == this.currentUser.uid));
        if(otherUsers.length == 0) {
          const toFindDuplicates = currentUser => currentUser.filter((item, index) => currentUser.indexOf(item) !== index);
          this.chats.push(({ ...(doc.data() as object), id: doc.id, otherUsers: toFindDuplicates(currentUser) }));
        } else {
          this.chats.push(({ ...(doc.data() as object), id: doc.id, otherUsers: otherUsers }));
        }
      });
      // console.log(this.chats);
      // kann man vielleicht noch auf die find methode umbauen und damit verkürzen
      for (let i = 0; i < this.chats.length; i++) {
        let otherUsers = this.chats[i].otherUsers;
        for (let i = 0; i < otherUsers.length; i++) {
          let actualMember = otherUsers[i];        
          await getDoc(doc(this.db, 'users', actualMember))
            .then((docData) => {
              let index = otherUsers.indexOf(actualMember);
              otherUsers[index] = docData.data(); 
            })
        }
      }      
    });
  }
}
