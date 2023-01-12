import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/modules/channels.class';
import { timestamp } from 'rxjs';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot } from '@firebase/firestore';



@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  channelId: string;
  channel: Channel;
  date: Date;
  db: any = getFirestore();

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore
  ) { }

  ngOnInit(): void {
    this.channel = new Channel;
    this.route.params.subscribe((params) => {
      this.channelId = params['id'];
      let document = doc(this.db, 'channels', this.channelId);
      getDoc(document)
        .then((doc) => {
          this.channel.channelName = doc.data()['channelName'];
          this.channel.channelDescription = doc.data()['channelDescription'];
          this.channel.created = doc.data()['created'];
          this.channel.messages = doc.data()['messages'];
        })
    })
  }

}
