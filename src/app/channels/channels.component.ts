import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/modules/channels.class';
import { timestamp } from 'rxjs';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot } from '@firebase/firestore';
import { UserService } from '../services/user.service';



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
    public user: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.user.channelEditor = true;
    this.user.chatEditor = false;
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
