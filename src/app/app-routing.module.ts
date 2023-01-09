import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogSuccessMessageComponent } from './dialog-components/dialog-success-message/dialog-success-message.component';
import { HomeComponent } from './home/home.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { AuthGuard } from './services/guards/auth.guard';
import { CreateChatComponent } from './create-chat/create-chat.component';

// , canActivate: [AuthGuard] 
const routes: Routes = [
  { path: '', component: StartScreenComponent },
  { path: 'home', component: HomeComponent,
    children: [
      // {path: '', component:HomeComponent},
      {path: 'create-chat', component:CreateChatComponent},
    ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
