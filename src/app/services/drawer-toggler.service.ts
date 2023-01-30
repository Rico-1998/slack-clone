import { Injectable } from '@angular/core';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatService } from './chat.service';
import { ChannelService } from './channel.service';
@Injectable({
  providedIn: 'root'
})
export class DrawerTogglerService {
  // isSidenavOpen: boolean = true;
  public type: any = 'side';
  public open: boolean = true;
  public showToggleBtn: boolean = false;

  constructor(
    public channel: ChannelService,
    public chats: ChatService,
  ) {
    // if(window.innerWidth < 600) {
    //   this.isSidenavOpen = true;
    // } else {
    //   this.isSidenavOpen = false;
    // }

   
  }

  toggleNav() {
    if(this.open) {
      this.open = false;
    } else {
      this.open = true;
    }
  }

  //Closes Nav and Threads on small screens
  closeNav() {
    if(this.type == 'over') {
      this.open = false;
    }
    if(window.innerWidth < 901) {
      this.channel.threadOpen = false;
      this.chats.threadOpen = false
    }
  }
}


