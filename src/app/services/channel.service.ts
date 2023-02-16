import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { addDoc, deleteDoc, doc, Firestore, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot, Timestamp } from '@firebase/firestore';
import { UserService } from '../services/user.service';
import { Message } from 'src/modules/messages.class';
import { MatDialog, MatDialogRef, MatDialogModule, MatDialogClose } from '@angular/material/dialog';
import { DialogDeleteMessageComponent } from '../dialog-components/dialog-delete-message/dialog-delete-message.component';
import { ObjectUnsubscribedError, Observable, Subscribable, timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  db: any = getFirestore();
  channelId: string;
  threadId: any;
  messageId: string;
  channels: any = [];
  allMessages: any[] = [];
  currentFilteredMessages = [];
  allThreadComments: any = [];
  newMessage: Message;
  newComment: Message;
  threadMessage: any;
  currentMessage: any;
  msgToEdit: any;
  currentChannel: any;
  threadOpen: boolean = false;
  threadLoading: boolean = false;
  channelLoading: boolean = false;
  shouldScroll = true;
  unsub: any;
  filteredValue: any;


  constructor(
    public user: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public userService: UserService,
  ) { }


  //**destroys the subscription */
  destroy() {
    if (this.unsub) {
      this.unsub();
    }
  }


  //**load the channels */
  async getChannels() {
    onSnapshot(collection(this.db, 'channels'), async (snapshot) => {
      this.channels = [];
      snapshot.docs.forEach(async (doc) => {
        await this.channels.push(({ ...(doc.data() as object), id: doc.id }));
        await this.getLastVisitForChannels();
      })
    },
      (error) => {
        console.warn('Loading all channels error', error);
      });
  }


  //**updates last user visit channel timestamp */
  async getLastVisitForChannels() {
    onSnapshot(collection(this.db, 'users', JSON.parse(localStorage.getItem('user')).uid, 'lastChannelVisits'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        let channel = this.channels.find(c => c.id == doc.id);
        if (channel) {
          channel.lastUserVisit = doc.data();
        }
      })
    },
      (error) => {
        console.warn('Setting last visit for channel error', error);
      });
  }


  //**  get channelRoom ID and and fills channel vars*/
  async getChannelRoom(channelRoomId) {
    this.channelId = channelRoomId['id'] || channelRoomId;
    this.currentChannel = await this.channels.find(a => a.id == this.channelId);
    if (this.currentChannel.created) {
      this.currentChannel.created = this.convertTimestamp(this.currentChannel?.created, 'onlyDate');
    }
    this.snapCurrentChannel();
  }


  //**subscribes the channel messages */
  snapCurrentChannel() {
    this.allMessages = [];
    this.currentFilteredMessages = [];
    const colRef = collection(this.db, 'channels', this.channelId, 'messages');
    const q = query(colRef, orderBy('timestamp'));
    this.unsub = onSnapshot(q, (snapshot) => {
      this.snapCurrentChannelMessages(snapshot);
      this.checkIfSnapIsEmpty();
    },
      (error) => {
        console.warn('Loading current channel error', error);
      });
    this.updateLastVisitTimestamp();
  }


  //**handles the snapshot messages */
  snapCurrentChannelMessages(snapshot) {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type == 'added') {
        this.addSnapMessage(change);
      } else if (change.type == 'removed') {
        this.deleteSnapMessage(change);
      } else if (change.type == "modified") {
        this.modifySnapMessage(change);
      } 
      this.channelLoading = false;
      this.showNewMessage();
    })
  }


  //**adds snapped messages to channel */
  async addSnapMessage(change) {
    let comments = (await getDocs(collection(this.db, 'channels', this.channelId, 'messages', change.doc.id, 'comments')));
    let message = { ...(change.doc.data() as object), id: change.doc.id, comments: comments.size };
    message['timestamp'] = this.convertTimestamp(message['timestamp'], 'full');
    this.allMessages.push(message);
    this.currentFilteredMessages.push(message);
  }


  //**finds and deletes snapped message */
  deleteSnapMessage(change) {
    let indexOfMessageToRemove = this.allMessages.findIndex(m => m.id == change.doc.id);
    this.allMessages.splice(indexOfMessageToRemove, 1);
    let indexOfFilteredMessageToRemove = this.allMessages.findIndex(m => m.id == change.doc.id);
    this.currentFilteredMessages.splice(indexOfFilteredMessageToRemove, 1);
  }


  //**finds the snaped message and modifies it */
  modifySnapMessage(change) {
    let messageToEdit = this.allMessages.filter(m => m.id == change.doc.id);
    messageToEdit = this.currentFilteredMessages.filter(m => m.id == change.doc.id);
    messageToEdit[0]['msg'] = change.doc.data()['msg'];
    messageToEdit[0]['edit'] = change.doc.data()['edit'];
  }


  //**checkes if no messages in channel */
  checkIfSnapIsEmpty() {
    setTimeout(() => {
      if (this.allMessages.length < 1) {
        this.channelLoading = false;
      }
    }, 500);
  }


  //**scolls to bottom */
  showNewMessage() {
    setTimeout(() => {
      this.shouldScroll = true;
    }, 150);
  }


  //**adding message to the picked channel */
  async postInChannel() {
    let timestamp = Timestamp.fromDate(new Date()).toDate();
    addDoc(collection(this.db, 'channels', this.channelId, 'messages'), {
      author: this.user.currentUser['userName'],
      timestamp: timestamp,
      msg: this.newMessage,
      edit: false,
    })
      .then(() => {
        this.updateLastMessageTimestamp(timestamp);
        setTimeout(() => {
          this.updateLastVisitTimestamp();
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
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (!this.allThreadComments.find(c => c.id == doc.id)) {
          let comment = { ...(doc.data() as object), id: doc.id };
          comment['timestamp'] = this.convertTimestamp(comment['timestamp'], 'full');
          this.allThreadComments.push(comment);
        }
      })
    },
      (error) => {
        console.warn('Loading comments to thread (channel) error', error);
      })
  }


  //** edit picked message and save in array and firebase */
  async editMessage(msg) {
    let docToUpdate = doc(this.db, 'channels', this.channelId, 'messages', this.msgToEdit['id']);
    await updateDoc(docToUpdate, {
      msg: msg,
      edit: true,
    });
    this.msgToEdit = [];
  }


  //** transforms timestamp to a date standard */
  convertTimestamp(timestamp, type) {
    if (typeof timestamp == 'string') {
      return timestamp
    } else {
      let date = timestamp?.toDate();
      let mm = date?.getMonth() + 1;
      let dd = date?.getDate();
      let yyyy = date?.getFullYear();
      let hours = date?.getHours();
      let minutes = date?.getMinutes();
      let fullDate = this.addZero(dd) + '/' + (this.addZero(mm)) + '/' + yyyy + ' ' + this.addZero(hours) + ':' + this.addZero(minutes);
      let onlyDate = dd + '/' + (mm) + '/' + yyyy;
      return (type == 'full') ? fullDate : onlyDate;
    }
  }

  addZero(time) {
    if (time < 10) {
      return '0' + time;
    } else return time;
  }

  //** open thread with all comments of the picked message*/
  openThread(id) {
    this.threadId = id;
    this.threadOpen = true;
    this.loadCommentsToThread();
    this.loadMessageToThread();
  }

  closeThread() {
    this.threadOpen = false;
    this.allThreadComments = [];
    this.threadMessage = undefined;
    this.threadId = undefined;
  }


  //* Updates the timestap when user last visited the channel*/
  async updateLastVisitTimestamp() {
    let currentUserId = JSON.parse(localStorage.getItem('user')).uid;
    const docToUpdate = doc(this.db, 'users', currentUserId, 'lastChannelVisits', this.channelId);
    await setDoc(docToUpdate, {
      time: Timestamp.fromDate(new Date()).toDate()
    });
  }

}

