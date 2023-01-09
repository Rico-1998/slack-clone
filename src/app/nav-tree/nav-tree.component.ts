import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.scss']
})
export class NavTreeComponent implements OnInit {
  openChannelPanel = false;
  openChatsPanel = false;

  channels: string[] = ['allgemein', 'angular', 'random'];
  chats: string[] = ['Tobias', 'Rico', 'Phil'];

  constructor() { }

  ngOnInit(): void {
  }

}
