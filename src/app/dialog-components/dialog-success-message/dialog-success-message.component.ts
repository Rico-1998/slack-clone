import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';


@Component({
  selector: 'app-dialog-success-message',
  templateUrl: './dialog-success-message.component.html',
  styleUrls: ['./dialog-success-message.component.scss']
})
export class DialogSuccessMessageComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogErrorComponent>

  ) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
