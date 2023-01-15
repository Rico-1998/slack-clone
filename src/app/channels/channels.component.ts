import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { collection, getFirestore, onSnapshot, Timestamp } from '@firebase/firestore';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';
import { doc, getDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  db = getFirestore();
  channelId: any;
  
  constructor(
    public user: UserService,
    private route: ActivatedRoute,
    public channel: ChannelService
    ) {}
    
    ngOnInit(): void {
      this.user.channelEditor = true;
      this.user.chatEditor = false;
      this.getChannelRoom();
      // this.channel.loadMessagesInChannel()
    }
    
    getChannelRoom(){
      this.route.params.subscribe((params) => {
        this.channelId = params['id'];
        let document = doc(this.db, 'channels', this.channelId);
        getDoc(document)
        .then((doc) => {
          this.channel.currentChannel = doc.data();
          console.log(this.channel.currentChannel);      
        })
    })
  }
  
}
