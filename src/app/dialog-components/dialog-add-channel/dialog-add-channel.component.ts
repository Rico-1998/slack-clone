import { Component, OnInit } from '@angular/core';
import { Firestore, getFirestore, collection, doc, setDoc, addDoc} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore'; //Tobi added Firestore version 8
import { Router } from '@angular/router';
import { Channel } from 'src/modules/channels.class';
import { timestamp } from 'rxjs';


@Component({
  selector: 'app-dialog-add-channel',
  templateUrl: './dialog-add-channel.component.html',
  styleUrls: ['./dialog-add-channel.component.scss']
})
export class DialogAddChannelComponent implements OnInit {
  channel = new Channel()
  channelName: string;
  
  constructor(
    private angularFirestore: AngularFirestore, //Tobi added Firestore version 8
    private firestore: Firestore,
    private router: Router
    ) { }

  ngOnInit(): void {
  }


  //**creates new Channel if not existing yet */
  async createChannel(){
    if(!this.channel.channelDescription) {this.channel.channelDescription = '-'}
    this.channel.created = new Date();
    this.angularFirestore
      .collection('channels')
      .add(this.channel.toJSON());
  }

}
