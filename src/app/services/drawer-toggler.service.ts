import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawerTogglerService {
isSidenavOpen: boolean = false;
  constructor() {
    // if(window.innerWidth < 600) {
    //   this.isSidenavOpen = true;
    // } else {
    //   this.isSidenavOpen = false;
    // }
   }

  toggleNav() {
    this.isSidenavOpen = !this.isSidenavOpen;    
  }
}
