import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { addDoc, collection, Firestore, onSnapshot } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { doc, getDoc, getFirestore } from '@firebase/firestore';
import { QuillEditorComponent } from 'ngx-quill';
import 'quill-emoji/dist/quill-emoji.js';
import { Message } from 'src/modules/messages.class';
import { ChannelsComponent } from '../channels/channels.component';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {
  messageText: string = '';
  valid: boolean = false;
  @ViewChild('messageInput')
  messageInput: QuillEditorComponent;

  modules = {
    'emoji-shortname': true,
    'emoji-textarea': false,
    'emoji-toolbar': true,

    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' },
      { 'list': 'bullet' }],
      ['link'],
      ['emoji']                      // link and image, video
    ]
  };

  userName: string;
  allMessages: any = [];
  messageForm: FormGroup;
  message = new Message;
  text: string; '';
  messageID: string = '';
  channelName: any;
  db: any = getFirestore();


  constructor(
    public firestore: Firestore,
    public userService: UserService,
    private route: ActivatedRoute,
    public channel: ChannelsComponent,
    public chatService: ChatService) {
    this.messageForm = new FormGroup({
      // 'msgEditor': new FormControl()
      msgEditor: new FormControl()
    })
  }
  
  ngOnInit(): void {
    console.log(this.userService.currentUser$);

        console.log(this.channel.currentChannel);
  }

  check() {
    if (this.userService.channelEditor) {
      console.log('channel');
    } else if (this.userService.chatEditor) {
      this.chatService.createChatRoom();
    }
  }



  checkEditor(event) {
    if (event.event === 'text-change') {
      this.chatService.chatMsg = event.html;
      if (this.chatService.chatMsg !== null) {
        this.valid = true;
      } else {
        this.valid = false;
      }
    }
  }

  // check() {
  //   this.message = this.messageForm.value.msgEditor;
  //   // this.messageInput.quillEditor.getContents([]);

  //   let ref = collection(this.db, 'channels', this.channel.channelId as string, 'messages');
  //   onSnapshot(ref, (snapshot) => {
  //     snapshot.docs.forEach((doc) => {
  //       this.allMessages.push({ ...(doc.data() as object), id: doc.id });
  //       console.log(this.allMessages);
  //     })
  //   })
  // }
}