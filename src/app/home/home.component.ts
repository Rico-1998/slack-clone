import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(public authService: AuthService, private firestore: Firestore, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getData();
  }

}
