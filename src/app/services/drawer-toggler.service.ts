import { Injectable } from '@angular/core';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawerTogglerService {
  isSidenavOpen: boolean = true;
  public type: any = 'side';
  public open: boolean = true;
  constructor() {
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

  closeNav() {
    if(this.type == 'over') {
      this.open = false
    }
  }
}
