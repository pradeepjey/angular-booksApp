import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { AppSearchService } from 'src/app/services/search.service';
import { BookModel } from '../../models/book';
import { AppBookService } from '../../services/book.service';
@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnDestroy{
  private unsubscribe: ReplaySubject<boolean> = new ReplaySubject(1);
  predictedValue: any = "";
  typedValue: string = "";
  bookList: BookModel[] = [];
  ENTER_KEYCODE: any = 13;
  RIGHT_KEYCODE: any = 39;
  constructor(
    public snackBar: MatSnackBar,
    private bookService: AppBookService,
    private router: Router,
    private searchService: AppSearchService
  ) {}

  ngOnInit(){}

  ngOnDestroy(){
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  /**
   * To get result based on text search
   * 
   * @memberof SearchBoxComponent
   */
  getResults(event: any){
    let txt = this.typedValue;
    if(txt.length == 0){
      this.predictedValue = "";
    }else{
      this.bookService.searchBook(txt).subscribe(res => {
        this.bookList = res;
        if(res.length > 0)
          this.predictedValue = this.bookList[0].name?.toLocaleLowerCase();
        else
          this.predictedValue = "";
      });
    }
  }

  /**
   * Keyup event handler
   * @param event 
   * 
   * @memberof SearchBoxComponent
   */
  keyupComplete(event: any){
    switch(event.keyCode) {
      case this.ENTER_KEYCODE:
        this.showBook();
        break;
      case this.RIGHT_KEYCODE:
        this.loadCompleteText();
        break;
      default:
        this.getResults(event)
    }
  }

  /**
   * To show a book on results page
   * 
   * @memberof SearchBoxComponent
   */
  showBook(){
    this.typedValue = this.predictedValue;
    let book: BookModel = this.bookList[0];
    this.searchService.sendNotification(book);
  }

  /**
   * To load remaining text on text box
   * 
   * @memberof SearchBoxComponent
   */
  loadCompleteText(){
    this.typedValue = this.predictedValue;
  }
}
