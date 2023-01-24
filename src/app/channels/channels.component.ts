import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { collection, getFirestore, onSnapshot, Timestamp, orderBy, query, serverTimestamp } from '@firebase/firestore';
import { ChannelService } from '../services/channel.service';
import { addDoc, deleteDoc, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { Message } from 'src/modules/messages.class';
import { timestamp } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteMessageComponent } from '../dialog-components/dialog-delete-message/dialog-delete-message.component';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
// import { query } from '@angular/animations';


@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  @ViewChild('scrollBox') private scrollBox: ElementRef;
  db = getFirestore();
  public displayEditMenu;
  messageToEdit: any;
  channelId: any;
  currentUserName: any;
  newMessage: Message;
  showBtn: boolean = false;
  textBoxPath: string = 'channels';
  textBoxPathEdit: string = 'edit-channel';
  currentMessage: any;
  messageEditable: boolean = false;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    public channel: ChannelService,
    public router: Router,
    public dialog: MatDialog,
  ) {
    route.params.subscribe(val => {
      this.getChannelRoom();
    });
  }


  ngOnInit() {
    this.userService.channelEditor = true;
    this.userService.chatEditor = false;
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;
  }

  async getChannelRoom() {
    this.route.params.subscribe((params) => {
      this.channel.channelId = params['id'];
    })
    let document = doc(this.db, 'channels', this.channel.channelId);
    await getDoc(document)
      .then((doc) => {
        this.channel.currentChannel = doc.data();
        this.channel.currentChannel.created = this.channel.convertTimestamp(this.channel.currentChannel.created, 'onlyDate');
      })
    this.loadMessagesInChannel();
  }


  async loadMessagesInChannel() {
    this.channel.allMessages = [];
    const colRef = collection(this.db, 'channels', this.channel.channelId, 'messages');
    const q = query(colRef, orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach(async (doc) => {
        if (!this.channel.allMessages.find(m => m.id == doc.id)) {
            let comments = (await getDocs(collection(this.db, 'channels', this.channel.channelId, 'messages', doc.id, 'comments')));
            let message = { ...(doc.data() as object), id: doc.id, comments: comments.size };
            message['timestamp'] = this.channel.convertTimestamp(message['timestamp'], 'full');
            this.channel.allMessages.push(message);}
      });
    });
  }

  openThread(id) {
    this.channel.threadId = id;
    this.channel.threadOpen = true;
    this.channel.loadCommentsToThread();
    this.channel.loadMessageToThread();
  }

  changePath(message) {
    this.channel.msgToEdit = message;
  }

  async deleteMessage(message: any) {
    console.log(message.id)
    await deleteDoc(doc(this.channel.db, 'channels', this.channel.channelId, 'messages', message.id));
    this.channel.allMessages = this.channel.allMessages.filter(item => item.id !== message.id) // wegen snapshot fehler
  }

}