import { Component, OnInit, HostListener } from '@angular/core';
import { Firestore, limit, onSnapshot, orderBy } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { collection, getDocs, getFirestore, query } from '@firebase/firestore';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { DrawerTogglerService } from '../services/drawer-toggler.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
  allUsers = [];
  db: any = getFirestore();
  colref: any = collection(this.db, 'users');
  sortedUser: any = query(this.colref, orderBy('name'), limit(5));

  constructor(
    public chatService: ChatService,
    public dialog: MatDialog,
    public userService: UserService,
    public toggler: DrawerTogglerService) { }

    showToggleBtn: boolean = false;

  ngOnInit(): void {
    let data = [];
    onSnapshot(this.colref, ((snapshot) => {
      snapshot.docs.forEach((doc) => {
        data.push(doc.data());
      })
      for (let i = 0; i < data.length; i++) {
        if (data[i].userName !== 'guest') {
          this.allUsers.push(data[i]);
        }
      }
    }));
  }

  openSettings() {
    this.dialog.open(UserSettingsComponent, { panelClass: 'custom-dialog-container' })
  }

}
