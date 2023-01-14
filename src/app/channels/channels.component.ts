import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/modules/channels.class';
import { timestamp } from 'rxjs';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot } from '@firebase/firestore';
// import { FirestoreService } from '../services/firestore.service';



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
  currentChannel: any = '';

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.channelId = params['id'];
      let document = doc(this.db, 'channels', this.channelId);
      getDoc(document)
        .then((doc) => {
          this.currentChannel = doc.data();
          console.log(this.currentChannel );
        })
    })
  }

}
