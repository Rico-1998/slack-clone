import { IfStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, orderBy, setDoc, where } from '@angular/fire/firestore';
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

  constructor(public userService: UserService) { }

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
      author: this.userService.currentUser.id,
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
    } else {
      this.saveMsg(roomId);
    }
    // interface chatMessage erstellen mit (timestamp, author, msg)
    // value aus dem texteditor holen
    // format chatMsg bearbeiten (siehe andere Gruppe)
  }
}

// let chats: any = query(collection(this.db, 'chats'), where("userId", "array-contains", userYouWantToChat.id), orderBy('userId', 'desc'));
// if (this.chatDocs.length == 0) {
//   addDoc(collection(this.db, 'chats'), {
//     userId: [this.userService.currentUser.id, userYouWantToChat]
// users: [{
//   name:this.userService.currentUser.userName,

//  },
// {
// name: userYouWantToChat.userName
// }]
//   })
// } else {
//   this.actualChatDocument = '';
//   this.actualChatDocument = this.chatDocs.find((n) => n['userId'].includes(this.userService.currentUser.id && userYouWantToChat));
//   console.log('das ist actualDoc', this.actualChatDocument);

//   if (this.userService.currentUser.id === userYouWantToChat) {
//     console.log('same');
//   } else if (this.actualChatDocument) {
//     console.log('klappt');
//   } else {
//     addDoc(collection(this.db, 'chats'), {
//       name: 'rico',
//       msg: 'test',
//       userId: [this.userService.currentUser.id, userYouWantToChat]
//     })
//   }

// chatDocs.forEach((element, index) => {
//   if (!element['userId'].includes(userYouWantToChat) && !element['userId'].includes(this.userService.currentUser.id)) {
//     console.log('klappt');
// addDoc(collection(this.db, 'chats'), {
//   name: 'rico',
//   msg: 'test',
//   userId: [this.userService.currentUser.id, userYouWantToChat]
// })
//   }
// })
// }

// .then((doc) => {
//   console.log(doc.docs.map(data => data.data() as object, ))
// })