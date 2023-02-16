import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
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
      ['image','emoji'],                  // link and image, video
    ]
  };


  constructor(
    public firestore: Firestore,
    public userService: UserService,
    public channel: ChannelService,
    public chatService: ChatService) {
    this.messageForm = new FormGroup({
      msgEditor: new FormControl()
    })
  }


  ngOnInit(): void { }


  //**checks where to add message from quill editor */
  check() {
    let quillEditorTextfield = document.querySelector('.ql-editor');
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
    } else if (this.textBoxPath == 'chat-thread') {
      this.chatService.msgToChatThread();
      this.messageForm.reset();
    } else if (this.textBoxPath == 'edit') {
      this.chatService.editMsg(this.chatService.chatMsg);
    } else if (this.textBoxPath == 'edit-channel') {
      this.channel.editMessage(this.chatService.chatMsg);
    }
    quillEditorTextfield.innerHTML = "";
  }


  //**puts message.value in quill editor */
  checkEditor(event: any) {
    if (event.event === 'text-change') {
      let text = event.html;
      if (text !== null) {
        this.channel.newMessage = text;
        this.channel.newComment = text;
        this.chatService.chatMsg = text;
        this.valid = true;
      } else {
        this.valid = false;
      }
    }
  }

  onSelectionChanged = (event) =>{
    if(event.oldRange == null){
       this.onFocus(event);
    }
    if(event.range == null){
       this.onBlur(event);
    }
 }

 onFocus(event) {
  event.editor.theme.quill.container.style = "border-color: #818385 !important;";
  event.editor.theme.modules.toolbar.container.style = "border-color: #818385 !important;";
}

 onBlur(event) {
  event.editor.theme.quill.container.style = "border-color: #464646 !important;";
  event.editor.theme.modules.toolbar.container.style = "border-color: #464646 !important;";  
}
}