import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';

//angular material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {  MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

//firebase imports
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DialogSuccessMessageComponent } from './dialog-components/dialog-success-message/dialog-success-message.component';
import { DialogErrorComponent } from './dialog-components/dialog-error/dialog-error.component';
import { HomeComponent } from './home/home.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { NavTreeComponent } from './nav-tree/nav-tree.component';
import { AngularFireModule } from '@angular/fire/compat'; //Tobi added Firestore version 8

import { MessageBoxComponent } from './message-box/message-box.component';
import { QuillModule } from 'ngx-quill';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { AutofocusDirective } from './autofocus.directive';
import { ChannelsComponent } from './channels/channels.component';
import { DialogAddChannelComponent } from './dialog-components/dialog-add-channel/dialog-add-channel.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ThreadComponent } from './thread/thread.component';
import { DialogDeleteMessageComponent } from './dialog-components/dialog-delete-message/dialog-delete-message.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ChatThreadComponent } from './chat-thread/chat-thread.component';
import { SanitizeHtmlPipePipe } from './sanitize-html-pipe.pipe';



@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    LoginComponent,
    RegisterComponent,
    DialogSuccessMessageComponent,
    DialogErrorComponent,
    HomeComponent,
    SearchbarComponent,
    NavTreeComponent,
    MessageBoxComponent,
    CreateChatComponent,
    AutofocusDirective,
    ChannelsComponent,
    DialogAddChannelComponent,
    ChatroomComponent,
    ThreadComponent,
    DialogDeleteMessageComponent,
    UserSettingsComponent,
    ChatThreadComponent,
    SanitizeHtmlPipePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), // Tobi added web version 8
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatDividerModule,
    MatSelectModule,
    MatAutocompleteModule,
    QuillModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
