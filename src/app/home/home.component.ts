import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
  public type: any = 'side';
  public open: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth < 700) {
      this.type = 'over';
      this.open = false;
    } else {
      this.type = 'side';
      this.open = true;
    }
  }

  constructor(public authService: AuthService, private firestore: Firestore, private userService: UserService, public toggler: DrawerTogglerService) { }

  ngOnInit(): void {
    this.userService.getData();
  }

}
