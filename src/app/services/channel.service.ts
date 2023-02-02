import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { addDoc, deleteDoc, doc, Firestore, getDoc, orderBy, query, serverTimestamp, setDoc, updateDoc } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot, Timestamp } from '@firebase/firestore';
import { UserService } from '../services/user.service';
import { Message } from 'src/modules/messages.class';
import { MatDialog, MatDialogRef, MatDialogModule, MatDialogClose } from '@angular/material/dialog';
import { DialogDeleteMessageComponent } from '../dialog-components/dialog-delete-message/dialog-delete-message.component';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channelId: string;
  channels: any = [];
  db: any = getFirestore();
  newMessage: Message;
  newComment: Message;
  threadId: any; // In use 
  threadOpen: boolean = false; // In use
  threadMessage: any; // In Use
  threadLoading: boolean = false;
  allThreadComments: any = [];
  allMessages: any[] = [];
  messageId: string;
  currentMessage: any;
  currentChannel: any;
  msgToEdit: any;
  shouldScroll = true;


  constructor(
    public user: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public userService: UserService,
  ) { }

  //**get the channels from firestore */
  // async getChannels() {
  //   while (!this.userService.loadedChannelVisits) {
  //     await new Promise(resolve => setTimeout(resolve,100));
  //   }
  //   onSnapshot(collection(this.db, 'channels'), (snapshot) => {
  //     this.channels = [];
  //     snapshot.docs.forEach((doc) => {
  //       const lastUserVisit = this.userService.lastChannelVisits.find(v => v.id == doc.id)?.time;
  //       this.channels.push(({ ...(doc.data() as object), id: doc.id, lastUserVisit: lastUserVisit }));
  //     })
  //   });
  // }
  
  async getChannels() {
    onSnapshot(collection(this.db, 'channels'), async (snapshot) => {
      this.channels = [];
      snapshot.docs.forEach(async (doc) => {
        await this.channels.push(({ ...(doc.data() as object), id: doc.id}));
      })
      await this.setLastVisitForChannel();
    });
  }

  async setLastVisitForChannel() {
    onSnapshot(collection(this.db, 'users', JSON.parse(localStorage.getItem('user')).uid, 'lastChannelVisits'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
       let channel = this.channels.find(c => c.id == doc.id);
       if(channel) {
        channel.lastUserVisit = doc.data();
       }
      })
    });
  }

  //**adding message to the picked channel */
  async postInChannel() {
    let timestamp = Timestamp.fromDate(new Date()).toDate();
    addDoc(collection(this.db, 'channels', this.channelId, 'messages'), {
      author: this.user.currentUser['userName'],
      timestamp: timestamp,
      msg: this.newMessage
    })
      .then(() => {
        this.updateLastMessageTimestamp(timestamp)
        setTimeout(() => {
          this.updateLastVisitTimestamp()
        }, 1000);
      });
      this.shouldScroll = true;
  }

  //* Updates the time when last message was send in channel */
  async updateLastMessageTimestamp(timestamp) {
    await updateDoc(doc(this.db, 'channels', this.channelId), {
      lastMessage: timestamp
    })
  }


  //** post comment in the thread of the picked message */
  postComment() {
    this.threadLoading = true;
    let timestamp = Timestamp.fromDate(new Date()).toDate();
    addDoc(collection(this.db, 'channels', this.channelId, 'messages', this.threadId, 'comments'), {
      author: this.user.currentUser['userName'],
      timestamp: timestamp,
      comment: this.newComment
    })
      .then(() => {
        let message = this.allMessages.find(m => m.id == this.threadId)['comments']++;
        this.threadLoading = false;
      })
  }


  //** loading picked message as head of the thread */
  async loadMessageToThread() {
    this.threadLoading = true;
    let document = doc(this.db, 'channels', this.channelId, 'messages', this.threadId);
    await getDoc(document)
      .then((doc) => {
        this.threadMessage = doc.data();
        this.threadMessage['timestamp'] = this.convertTimestamp(this.threadMessage['timestamp'], 'onlyDate');
        this.threadLoading = false;
      })
  }


  //** loading all saved comments to a picked thread*/
  async loadCommentsToThread() {
    this.allThreadComments = [];
    const colRef = collection(this.db, 'channels', this.channelId, 'messages', this.threadId, 'comments');
    const q = query(colRef, orderBy('timestamp'));
    await onSnapshot(q, (snapshot) => {
      // console.log(snapshot.docs.length)
      snapshot.docs.forEach((doc) => {
        if (!this.allThreadComments.find(c => c.id == doc.id)) {
          let comment = { ...(doc.data() as object), id: doc.id };
          comment['timestamp'] = this.convertTimestamp(comment['timestamp'], 'full');
          this.allThreadComments.push(comment);
        }
      })
    })
  }


  //** gets id of the clicked message*/
  getCurrentMessage(id: string) {
    this.messageId = id;
    return this.allMessages.find(item => item.id === id);
  }


  //** edit picked message and save in array and firebase */
  async editMessage(msg) {
    console.log(msg);
    console.log(doc(this.db, 'channels', this.channelId, 'messages', this.messageId))
    let docToUpdate = doc(this.db, 'channels', this.channelId, 'messages', this.messageId);
    let message = this.allMessages.find(m => m.id == this.messageId); // wegen snapshot fehler
    message['msg'] = msg; // wegen snapshot fehler
    await updateDoc(docToUpdate, {
      msg: msg
    })
  }


  //** transforms timestamp to a date standard */
  convertTimestamp(timestamp, type) {
    let date = timestamp?.toDate();
    let mm = date?.getMonth();
    let dd = date?.getDate();
    let yyyy = date?.getFullYear();
    let hours = date?.getHours();
    let minutes = date?.getMinutes();
    let secondes = date?.getSeconds();
    if (secondes < 10) {
      secondes = '0' + secondes
    }
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    let fullDate = dd + '/' + (mm + 1) + '/' + yyyy + ' ' + hours + ':' + minutes;
    let onlyDate = dd + '/' + (mm + 1) + '/' + yyyy;
    if (type == 'full') {
      return fullDate;
    } else return onlyDate;
  }

   //* Updates the timestap when user last visited the channel*/
   async updateLastVisitTimestamp() {
    // this.updateLastVisitsLocally();
    const docToUpdate = doc(this.db, 'users', JSON.parse(localStorage.getItem('user')).uid, 'lastChannelVisits', this.channelId);
     await setDoc(docToUpdate, {
      time: Timestamp.fromDate(new Date()).toDate()
    });
  }

  updateLastVisitsLocally() {
    const channel = this.channels.find(c => c.id == this.channelId);
    if(channel) {
      channel.lastUserVisit = Timestamp.fromDate(new Date());
    }
  }
}

