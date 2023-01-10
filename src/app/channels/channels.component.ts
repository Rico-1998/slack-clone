import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/modules/channels.class';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
    // private angularFirestore: AngularFirestore
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



    this.channel = new Channel;
    this.route.params.subscribe((params) => {
      this.channelId = params['id'];
      let document = doc(this.db, 'channels', this.channelId);
      getDoc(document)
        .then((doc) => {
          console.log(doc.data());
        console.log(channel)
        })
    })
  }

}
