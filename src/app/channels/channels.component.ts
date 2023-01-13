import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/modules/channels.class';
import { timestamp } from 'rxjs';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot } from '@firebase/firestore';
import { FirestoreService } from '../services/firestore.service';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  channelId: string;
  channel: Channel;
  userName: any;
  date: Date;
  db: any = getFirestore();
  currentChannel: any = '';

  constructor(
    public firestoreService: FirestoreService,
    public user: UserService,
    private route: ActivatedRoute,
    private firestore: Firestore
  ) { }

  ngOnInit(): void {
    // this.channel = new Channel;
    // this.route.params.subscribe((params) => {
    //   this.channelId = params['id'];
    //   this.angularFirestore
    //     .collection('channels')
    //     .doc(this.channelId)
    //     .valueChanges()
    //     .subscribe((channel: any) => {
    //       this.channel.channelName = channel.channelName;
    //       this.channel.channelDescription = channel.channelDescription;
    //       this.channel.created = channel.created;
    //       this.channel.messages = channel.messages;
    //     });
    // })

    // this.channel = new Channel;
    this.route.params.subscribe((params) => {
      this.channelId = params['id'];
      let document = doc(this.db, 'channels', this.channelId);
      getDoc(document)
        .then((doc) => {
          this.firestoreService.channelID = this.channelId;
          this.firestoreService.currentChannel = doc.data();
          // this.channel.channelName = doc.data()['channelName'];
          // this.channel.channelDescription = doc.data()['channelDescription'];
          // this.channel.created = doc.data()['created'];
          // this.channel.messages = doc.data()['messages'];
        })
    })
  }

}
