import { Component, OnChanges, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { doc, getDoc, getFirestore } from '@firebase/firestore';
import 'quill-emoji/dist/quill-emoji.js';
import { Message } from 'src/modules/messages.class';



@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {
  messageText: string = '';

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
  text : string; '';
  messageID: string = '';
  channelName: any = '';
  db: any = getFirestore();


  constructor(public firestore:Firestore,
    private route: ActivatedRoute) {
    this.messageForm = new FormGroup({
      'msgEditor': new FormControl()
    })
  }

  ngOnInit(): void {

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
    console.log(event.event);
    console.log(this.message);

  }


}
