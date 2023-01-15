import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  pageNumber: number = 1;

  constructor(private router: Router ) {}

  ngOnInit(){
    let url = location.pathname;
    this.pageNumber = (url == "/")? 1 : 2;
  }

  /**
   * To set page number
   * @param page 
   * 
   * @memberof HeaderComponent
   */
  currentPage(page: number){
    this.pageNumber = page;
  }
}
