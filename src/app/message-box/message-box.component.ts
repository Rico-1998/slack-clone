import { Component, OnChanges, OnInit, ViewChild, Input } from '@angular/core';
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

  // db: any = getFirestore();
  messageText: string = '';
  valid: boolean = false;
  @ViewChild('messageInput')
  messageInput: QuillEditorComponent;
  messageForm: FormGroup;
  @Input() textBoxPath;

  modules = {
    'emoji-shortname': true,
    'emoji-textarea': false,
    'emoji-toolbar': true,

    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' },
      { 'list': 'bullet' }],
      ['link', 'image'],
      ['emoji']                   // link and image, video
    ]
  };


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
    // console.log(this.userService.currentUser$);
  }


  check() {
    var quillEditorTextfield = document.getElementsByClassName("ql-editor");
    if (this.textBoxPath == 'channels') {
      this.channel.postInChannel();
      this.messageForm.reset();
    } else if (this.textBoxPath == 'create-chat') {
      this.chatService.createChatRoom();
      this.messageForm.reset();
    } else if (this.textBoxPath == 'thread') {
      this.channel.postComment();
      this.messageForm.reset();
    } else if (this.textBoxPath == 'chatroom') {
      this.chatService.addMessage();
      this.messageForm.reset();
    }
    quillEditorTextfield[0].innerHTML = "";
  }


  checkEditor(event: any) {
    if (event.event === 'text-change') {
      let text = event.html;
      if (text !== null) {
        this.channel.newMessage = event.html;
        this.channel.newComment = event.html;
        this.chatService.chatMsg = event.html;
        this.valid = true;
      } else {
        this.valid = false;
      }
    }
  }

}