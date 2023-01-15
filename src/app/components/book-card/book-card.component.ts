import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BookModel } from 'src/app/models/book';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ReplaySubject, Subscription, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit, OnDestroy {
  @Input() book: BookModel = {};
  @Output() updateStatus = new EventEmitter();
  @Output() openBookDetails = new EventEmitter();
  private unsubscribe: ReplaySubject<boolean> = new ReplaySubject(1);
  private subscriptionList = new Subscription();
  
  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
    this.subscriptionList.unsubscribe();
  }

  /**
   * To open confirmation dialog
   * @param book 
   * 
   * @memberof BookCardComponent
   */
  openDialog(book: BookModel) {
    const dialogRef = this.dialog.open(ConfirmationComponent);
    this.subscriptionList.add(
      dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.triggerStatusUpdate(book, !book.isFavourite);

      })
    );
  }

  /**
   * To trigger status update
   * 
   * @memberof BookCardComponent
   */
  triggerStatusUpdate(bookInfo:BookModel, statusInfo: boolean){
    let object = { book: bookInfo, status: statusInfo };
    this.updateStatus.emit(object)
  }

  /**
   * To open details page
   * 
   * @memberof BookCardComponent
   */
  triggerOpenBookDetails(bookInfo:BookModel){
    let object = { book: bookInfo};
    this.openBookDetails.emit(object);
  }

  /**
   * To generate random rating
   * @returns random rating
   * 
   * @memberof BookCardComponent
   */
  generateRating(){
    var precision = 100; // 2 decimals
    return Math.floor(Math.random() * (10 * precision - 1 * precision) + 1 * precision) / (1*precision)/2;
  }
}
