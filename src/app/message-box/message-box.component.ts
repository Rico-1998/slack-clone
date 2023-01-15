import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { addDoc, collection, Firestore, onSnapshot } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { doc, getDoc, getFirestore } from '@firebase/firestore';
import { QuillEditorComponent } from 'ngx-quill';
import 'quill-emoji/dist/quill-emoji.js';
import { ChannelService } from '../services/channel.service';
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
  messageForm: FormGroup;
  messageID: string = '';
  channelName: any;
  db: any = getFirestore();


  constructor(
    public firestore: Firestore,
    public userService: UserService,
    private route: ActivatedRoute,
    public channel: ChannelService,
    public chatService: ChatService) {
    this.messageForm = new FormGroup({
      msgEditor: new FormControl()
    })
  }
  
  
  ngOnInit(): void {
    console.log(this.userService.currentUser$);
  }


  check() {
    if (this.userService.channelEditor) {
      this.channel.postInChannel();
    } else if (this.userService.chatEditor) {
      this.chatService.createChatRoom();
    }
  }


  checkEditor(event) {
    if (event.event === 'text-change') {
<<<<<<< HEAD
      this.channel.newMessage = event.html.replace(/<[^>]+>/g, '');
      this.chatService.chatMsg = event.html;
      // if (this.chatService.chatMsg !== null) {
      if (this.messageText !== null) {
=======
      this.chatService.chatMsg = event.html;
      if (this.chatService.chatMsg !== null) {
>>>>>>> 17ec9022e41fa532a44cbd24bd0ae35b26e636ce
        this.valid = true;
      } else {
        this.valid = false;
      }
    }
  }

}