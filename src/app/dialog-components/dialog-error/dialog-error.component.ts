import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/login/login.component';

@Component({
  selector: 'app-dialog-error',
  templateUrl: './dialog-error.component.html',
  styleUrls: ['./dialog-error.component.scss']
})
export class DialogErrorComponent implements OnInit {
  errorMessage: string;

  constructor(
    public authService: AuthService,
    private dialogRef: MatDialogRef<DialogErrorComponent>
  ) {
    if (authService.errorCode == 'auth/wrong-password') {
      this.errorMessage = 'Seems like you insert a wrong password. Please try again.'
    } else if (authService.errorCode == 'auth/user-not-found') {
      this.errorMessage = 'Seems like you insert a wrong username. Please try again.'
    } else if (authService.errorCode == 'auth/email-already-in-use') {
      this.errorMessage = 'Seems like you already have an account. Please login.'
    } else if (authService.errorCode == 'auth/too-many-requests') {
      this.errorMessage = 'Seems like you insert wrong data to many times. Pleas wait a moment and try it again later.'
    } else this.errorMessage = authService.errorCode;
  }


  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
