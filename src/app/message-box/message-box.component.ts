import { Component, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'quill-emoji/dist/quill-emoji.js';



@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {
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
  text: any = '';


  constructor() {
    this.messageForm = new FormGroup({
      'msgEditor': new FormControl()
    })
  }

  ngOnInit(): void {

  }

  sendMessage() {

  }

  checkEditor(event) {
    console.log(event.event);
    console.log(this.text);

  }


}
