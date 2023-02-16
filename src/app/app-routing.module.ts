import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { AuthGuard } from './services/guards/auth.guard';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { ChannelsComponent } from './channels/channels.component';
import { ChatroomComponent } from './chatroom/chatroom.component';

const routes: Routes = [ 
{ path: '', component: StartScreenComponent, canActivate: [AuthGuard] },
  { path: 'channels', component: ChannelsComponent, canActivate: [AuthGuard] },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: 'create-chat', component: CreateChatComponent, canActivate: [AuthGuard] },
      { path: 'channel/:id', component: ChannelsComponent, canActivate: [AuthGuard] },
      { path: 'chatroom/:id', component: ChatroomComponent, canActivate: [AuthGuard] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
