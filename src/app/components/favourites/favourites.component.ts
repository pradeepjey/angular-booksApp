import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { navLinks } from 'src/app/constants/nav';
import { BookModel } from '../../models/book';
import { AppBookService } from '../../services/book.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit, OnDestroy{
  private unsubscribe: ReplaySubject<boolean> = new ReplaySubject(1);
  booklist: BookModel[] = [];
  constructor(
    public snackBar: MatSnackBar,
    private bookService: AppBookService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getBookList();
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
  getBookList(){
    this.bookService.getFavouriteBookList()
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
