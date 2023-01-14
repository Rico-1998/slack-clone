import { Injectable } from '@angular/core';
import { addDoc, addDoc, collection, doc, doc, getFirestore, orderBy, setDoc, setDoc, where } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
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
    return array.sort().join('')
  }


  async createChat() {
    this.foundedUsers = [];

    // addDoc(collection(this.db, 'chats', this.arrayToString(this.createRoomId()), 'roomId'), {
    //   userIds: [this.createRoomId()],
    // });
    let roomId = this.arrayToString(this.createRoomId());
    setDoc(doc(this.db, 'chats', roomId), {
      userIds: this.createRoomId(),
    });
    addDoc(collection(this.db, 'chats', roomId, 'messages'), {
      msg: this.chatMsg,
    })
    // interface chatMessage erstellen mit (timestamp, author, msg)
    // value aus dem texteditor holen
    // format chatMsg bearbeiten (siehe andere Gruppe)


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




  }
}
