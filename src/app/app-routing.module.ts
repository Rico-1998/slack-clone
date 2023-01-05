import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogSuccessMessageComponent } from './dialog-components/dialog-success-message/dialog-success-message.component';
import { StartScreenComponent } from './start-screen/start-screen.component';

const routes: Routes = [
  { path: '', component: StartScreenComponent },
  { path: 'success', component: DialogSuccessMessageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
