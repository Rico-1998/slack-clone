import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { DrawerTogglerService } from '../services/drawer-toggler.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public authService: AuthService, private firestore: Firestore, public toggler: DrawerTogglerService) { }
  
  ngOnInit(): void {
   
  }


}
