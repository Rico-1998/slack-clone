import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogSuccessMessageComponent } from './dialog-components/dialog-success-message/dialog-success-message.component';
import { HomeComponent } from './home/home.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { AuthGuard } from './services/guards/auth.guard';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { ChannelsComponent } from './channels/channels.component';
import { ChatroomComponent } from './chatroom/chatroom.component';

// , canActivate: [AuthGuard] 
const routes: Routes = [
  { path: '', component: StartScreenComponent },
  { path: 'channels', component: ChannelsComponent, canActivate: [AuthGuard] },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: 'create-chat', component: CreateChatComponent },
      { path: 'channel/:id', component: ChannelsComponent },
      { path: 'chatroom/:id', component: ChatroomComponent },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
