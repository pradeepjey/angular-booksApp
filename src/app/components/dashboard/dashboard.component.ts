import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReplaySubject, Subscription, takeUntil } from 'rxjs';
import { navLinks } from 'src/app/constants/nav';
import { AppSearchService } from 'src/app/services/search.service';
import { BookModel } from '../../models/book';
import { AppBookService } from '../../services/book.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy{
  private unsubscribe: ReplaySubject<boolean> = new ReplaySubject(1);
  subscription: Subscription | undefined;
  booklist: BookModel[] = [];
  constructor(
    public snackBar: MatSnackBar,
    private bookService: AppBookService,
    private router: Router,
    private appSearchService: AppSearchService
  ) {}

  ngOnInit() {
    this.subscription = this.appSearchService.getNotification().subscribe((data: BookModel) => {
      this.booklist = [data];
    });
    this.getBookList();
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
    this.subscription?.unsubscribe();
  }

  /**
   * To get book list
   * 
   * @memberof DashboardComponent
   */
  getBookList(){
    this.bookService.getBookList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res : BookModel[]) => {
        this.booklist = res;
    });
  }

  /**
   * To update book's favourite status
   * 
   * @memberof DashboardComponent
   */
  updateStatus(event: any){
    this.bookService.setFavouriteStatus(event.book._id, event.status)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((res : string) => {
      this.snackBar.open(res, '', {
        duration: 3000
      });
      this.getBookList();
    })
  }

  /**
   * To open book details page
   * 
   * @memberof DashboardComponent
   */
  openBookDetails(event: any){
    this.router.navigate([navLinks.BOOK_DETAILS, event.book._id]);
  }
}
