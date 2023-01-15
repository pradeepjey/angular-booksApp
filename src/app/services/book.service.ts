import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { APILINK } from "../constants/api";
import { AppBaseService } from "./http.service";

@Injectable()
export class AppBookService{
    constructor(
        private baseservice: AppBaseService,
        public snackBar: MatSnackBar
    ) {}

    /**
     * To get book list
     * 
     * @memberof AppBookService
     */
    getBookList(){
        return this.baseservice.getResource(APILINK.GET_BOOKS);
    }

    /**
     * To get book
     * 
     * @param id unique book id
     * @memberof AppBookService
     */
    getBook(id : string){
        let url = APILINK.GET_BOOK + "/" + id
        return this.baseservice.getResource(url);
    }

    /**
     * To get favourite book list
     * 
     * @memberof AppBookService
     */
    getFavouriteBookList(){
        return this.baseservice.getResource(APILINK.GET_FAVOURITE_BOOKS);
    }

    /**
     * To set status of a book as favourite
     * 
     * @memberof AppBookService
     */
    setFavouriteStatus(bookId: any, status: boolean){
        let url = APILINK.SET_FAVOURITE_BOOK + bookId + "/" + status; 
        return this.baseservice.patchResource(url, {})
    }

    /**
     * To search for a book
     * 
     * @memberof AppBookService
     */
    searchBook(txt : string){
        let url = APILINK.SEARCH_BOOK;
        let object = { txt: txt };
        return this.baseservice.postResource(url, object);
    }
}