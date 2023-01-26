import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { addDoc, deleteDoc, doc, Firestore, getDoc, orderBy, query, serverTimestamp, updateDoc } from '@angular/fire/firestore';
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

  constructor(
    public user: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }


  //**adding message to the picked channel */
  postInChannel() {
    let timestamp = Timestamp.fromDate(new Date()).toDate();
    addDoc(collection(this.db, 'channels', this.channelId, 'messages'), {
      author: this.user.currentUser['userName'],
      timestamp: timestamp,
      msg: this.newMessage
    })
      .then(() => {
      });
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
    console.log(this.messageId);
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


  //** open dialog for confirming to delete message */
  openDeleteMessageDialog(message) {
    this.currentMessage = message;
    this.dialog.open(DialogDeleteMessageComponent)
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

}
