import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BookModel } from "../models/book";

@Injectable()
export class AppSearchService{
    private subject = new Subject<any>();
    constructor() {}

    /**
     * To send an search notification
     * @param message 
     * 
     * @memberof AppSearchService
     */
    sendNotification(book: BookModel) {
        this.subject.next(book);
    }

    /**
     * To clear notification
     * 
     * @memberof AppSearchService
     */
    clearNotification() {
        this.subject.next(null);
    }

    /**
     * To subscribe to a notification
     * @returns observable
     * 
     * @memberof AppSearchService
     */
    getNotification(): Observable<any> {
        return this.subject.asObservable();
    }
}