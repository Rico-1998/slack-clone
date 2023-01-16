import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {

  constructor(
    public channel: ChannelService,
  ) { }

  ngOnInit(): void {
  }

}
