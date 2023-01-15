import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>){ }

  ngOnInit() {}
  
  /**
   * On no clicked
   * 
   * @memberof ConfirmationComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * On Yes clicked
   * 
   * @memberof ConfirmationComponent
   */
  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
