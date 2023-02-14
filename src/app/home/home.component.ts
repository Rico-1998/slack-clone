import { Component, HostListener, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { DrawerTogglerService } from '../services/drawer-toggler.service';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //Close Drawer on small screen size
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth < 600) {
      this.toggler.type = 'over';
      this.toggler.open = false;
      this.toggler.showToggleBtn = true;
    } else {
      this.toggler.type = 'side';
      this.toggler.open = true;
      this.toggler.showToggleBtn = false;
    }
  }

  constructor(
    public authService: AuthService, 
    private firestore: Firestore, 
    private userService: UserService, 
    public toggler: DrawerTogglerService, ) { }

    
  async ngOnInit() {
    this.userService.getData();
        

    if(window.innerWidth < 600) {
      this.toggler.open = false;
      this.toggler.type = 'over';
      this.toggler.showToggleBtn = true;
    } 
  }
}
