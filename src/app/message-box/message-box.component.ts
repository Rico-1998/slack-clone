import { Component, OnChanges, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { doc, getDoc, getFirestore } from '@firebase/firestore';
import 'quill-emoji/dist/quill-emoji.js';
import { Message } from 'src/modules/messages.class';
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

  messageForm: FormGroup;
  message = new Message;
  text: string; '';
  messageID: string = '';
  channelName: any = '';
  db: any = getFirestore();

  constructor(
    public firestore: Firestore,
    private route: ActivatedRoute,
    public userService: UserService,
    public chatService: ChatService) {
    this.messageForm = new FormGroup({
      // 'msgEditor': new FormControl()
      msgEditor: new FormControl()
    })
  }

  ngOnInit(): void {

  }

  check() {
    if (this.userService.channelEditor) {
      console.log('channel');
    } else if (this.userService.chatEditor) {
      this.chatService.createChat();
    }
  }

  async sendMessage() {
    this.route.params.subscribe((params) => {
      this.messageID = params['id'];
      let document = doc(this.db, 'messages', this.messageID);
      getDoc(document)
        .then((doc) => {
          console.log(doc.data());
        })
    })
  }

  checkEditor(event) {
    if (event.event === 'text-change') {
      this.chatService.chatMsg = event.html
      if (this.chatService.chatMsg !== null) {
        this.valid = true;
      } else {
        this.valid = false;
      }
    }
  }

  onSubmit() {
    // this.firestoreService.messageInput = this.messageForm.value.msgEditor;
    // this.firestoreService.postMessage();
    // console.log(this.firestoreService.messageInput);
  }


}
