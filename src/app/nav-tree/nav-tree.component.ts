import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-components/dialog-add-channel/dialog-add-channel.component';

@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.scss']
})
export class NavTreeComponent implements OnInit {
  openChannelPanel = false;
  openChatsPanel = false;

  channels: string[] = ['allgemein', 'angular', 'random'];
  chats: string[] = ['Tobias', 'Rico', 'Phil', 'Viktor'];
  
  constructor(
    public dialog: MatDialog,
    ){}

  ngOnInit(): void {
  }

  openDialogAddChannel(){
    this.dialog.open(DialogAddChannelComponent);
  }

}
