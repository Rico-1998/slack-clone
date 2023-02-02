import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { collection, getFirestore, onSnapshot,  orderBy, query } from '@firebase/firestore';
import { ChannelService } from '../services/channel.service';
import { Message } from 'src/modules/messages.class';
import { UserService } from '../services/user.service';
import { doc, getDocs } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';

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
  currentMessage: any;
  currentUserName: any;
  currentChannelRoom: any;
  newMessage: Message;
  showBtn: boolean = false;
  textBoxPath: string = 'channels';
  textBoxPathEdit: string = 'edit-channel';
  messageEditable: boolean = false;
  lastMessage: any;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    public channelService: ChannelService,
    public router: Router,
    public service: FirestoreService,
  ) {
    route.params.subscribe((channelRoomId) => {
      this.getChannelRoom(channelRoomId);
    });

  }

  ngOnInit() {
    this.channelService.updateLastVisitTimestamp()
    this.userService.channelEditor = true;
    this.userService.chatEditor = false;
    this.scrollToBottom();    
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    
  }

  scrollToBottom(): void {
    if(this.channelService.shouldScroll) {
      setTimeout(() => {
        this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;
      });
      setTimeout(() => {
        this.channelService.shouldScroll = false;
      }, 100);
    }
  }

  //**  get channelRoom ID*/
  getChannelRoom(channelRoomId: Params) {
    this.channelService.channelId = channelRoomId['id'];
    const unsub = onSnapshot(doc(this.db, 'channels', channelRoomId['id']), async (snapshot) => {      
      if(channelRoomId['id'] != this.channelService.channelId) {
        unsub();
      } else {
        this.channelService.currentChannel = snapshot.data();
        this.channelService.currentChannel.created = this.channelService.convertTimestamp(this.channelService.currentChannel.created, 'onlyDate');        
      }
    });
    this.loadMessagesInChannel(channelRoomId['id']);
    this.channelService.updateLastVisitTimestamp();     
  }

  loadMessagesInChannel(currentChannelId: string) {
    this.channelService.allMessages = [];
    const colRef = collection(this.db, 'channels', this.channelService.channelId, 'messages');
    const q = query(colRef, orderBy('timestamp'));
    const unsub = onSnapshot(q, (snapshot) => { 
      if(currentChannelId != this.channelService.channelId) {
        unsub();        
      }   else {
        this.snapCurrentChannelMessages(snapshot);      
      }
    });    
  }

  snapCurrentChannelMessages(snapshot) {
    snapshot.docs.forEach(async (doc) => {
      if (!this.channelService.allMessages.find(m => m.id == doc.id)) {
          let comments = (await getDocs(collection(this.db, 'channels', this.channelService.channelId, 'messages', doc.id, 'comments')));
          let message = { ...(doc.data() as object), id: doc.id, comments: comments.size };
          message['timestamp'] = this.channelService.convertTimestamp(message['timestamp'], 'full');
          this.channelService.allMessages.push(message);
        } 
          this.showNewMessage();
    });
  }

  showNewMessage() {
    setTimeout(() => {
      this.channelService.shouldScroll = true;
    }, 150);
  }

  // /** load all messages to the current channel */
  // async loadMessagesInChannel() {
  //   const colRef = collection(this.db, 'channels', this.channelService.channelId, 'messages');
  //   const q = query(colRef, orderBy('timestamp'));
  //   const unsub = onSnapshot(q, (snapshot) => {
  //     if(!this.channelService.channelId) {
  //       unsub();
  //     } else {
  //       this.channelService.allMessages = [];
  //       snapshot.docs.forEach(async (doc) => {
  //         let comments = (await getDocs(collection(this.db, 'channels', this.channelService.channelId, 'messages', doc.id, 'comments')));
  //         let message = {...(doc.data() as object), id: doc.id, comments: comments.size };
  //         message['timestamp'] = this.channelService.convertTimestamp(message['timestamp'], 'full');
  //         this.channelService.allMessages.push(message);
  //       });
  //     }
  //   });
  //   this.showNewMessage();
  // }

  


  //** open thread with all comments of the picked message*/
  openThread(id) {
    this.channelService.threadId = id;
    this.channelService.threadOpen = true;
    this.channelService.loadCommentsToThread();
    this.channelService.loadMessageToThread();
  }


  //** */
  changePath(message) {
    this.channelService.msgToEdit = message;
  }

}