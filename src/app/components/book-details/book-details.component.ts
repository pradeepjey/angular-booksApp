import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subscription, takeUntil } from 'rxjs';
import { BookModel } from '../../models/book';
import { AppBookService } from '../../services/book.service';
import { randomTime } from '../../helper/random-date';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy{
  private unsubscribe: ReplaySubject<boolean> = new ReplaySubject(1);
  private subscriptionList = new Subscription();
  book: BookModel = {};
  bookId : any = "";
  randomDate: any = new Date();
  constructor(
    public snackBar: MatSnackBar,
    private bookService: AppBookService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');
    this.randomDate = randomTime(new Date("10-10-2015 10:30"), new Date("12-10-2015 02:10"));
    this.getBook(this.bookId);

  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  /**
   * To get book list
   * 
   * @memberof DashboardComponent
   */
  getBook(id : any){
    this.bookService.getBook(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res : BookModel) => {
        this.book = res;
    });
  }

  /**
   * To update book's favourite status
   * 
   * @memberof DashboardComponent
   */
  updateStatus(book: BookModel, status: boolean){
    this.bookService.setFavouriteStatus(book._id, status)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((res : string) => {
      this.snackBar.open(res, '', {
        duration: 3000
      });
      this.getBook(this.bookId);
    })
  }

  /**
   * To open confirmation dialog
   * @param book 
   * 
   * @memberof DashboardComponent
   */
  openDialog(book: BookModel) {
    const dialogRef = this.dialog.open(ConfirmationComponent);
    this.subscriptionList.add(
      dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.updateStatus(book, !book.isFavourite);

      })
    );
  }

  /**
   * To generate random rating
   * @returns random rating
   * 
   * @memberof DashboardComponent
   */
  generateRating(){
    var precision = 100; // 2 decimals
    return Math.floor(Math.random() * (10 * precision - 1 * precision) + 1 * precision) / (1*precision)/2;
  }
}
