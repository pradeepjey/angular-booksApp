import { throwError, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { map, catchError,  } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastrService } from "ngx-toastr";
import {
  HttpClient,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent
} from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable()
export class AppBaseService implements HttpInterceptor {
  env: any = environment;
  httpOptions = {
    headers: new HttpHeaders({
      responseType: "json"
    })
  };

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private toastr: ToastrService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let url = request.url;
    if (!request.url.includes("integration/token")) {
      const languageCode = localStorage.getItem("lan");
      request = request.clone({
        setHeaders: {
          "X-API-VERSION": "1",
          "X-LANGUAGE": languageCode? languageCode.toUpperCase(): "EN",
        }
      });
    }
    return next.handle(request).pipe(catchError(response => {
      this.displayToastMessage(response, url);
      return throwError(response);
    }));
  }

  /**
   * To send get request
   * @param api 
   * @returns object array
   * 
   * @memberof AppBaseService
   */
  getResource(api : string) {
    const data = this.env.baseUrl + api;
    return this.http.get(data, this.httpOptions).pipe(map((res: any) => res));
  }

  /**
   * To send post request
   * @param api 
   * @param payload 
   * @returns object array
   * 
   * @memberof AppBaseService
   */
  postResource(api: string, payload: any) {
    const url = this.env.baseUrl + api;
    return this.http
      .post(url, payload, this.httpOptions)
      .pipe(map((res: any) => res));
  }

  /**
   * To send put request
   * @param api 
   * @param payload 
   * @returns object array
   * 
   * @memberof AppBaseService
   */
  putResource(api: string, payload: any) {
    const url = this.env.baseUrl + api;
    return this.http.put(url, payload, this.httpOptions).pipe(map((res: any) => res));
  }

  /**
   * To send patch request
   * @param api
   * @param payload
   * @returns object array
   * 
   * @memberof AppBaseService
   */
  patchResource(api: string, payload: any) {
    const url = this.env.baseUrl + api;
    return this.http
      .patch(url, payload, this.httpOptions)
      .pipe(map((res: any) => res));
  }

  /**
   * To display error messages
   * @param response 
   * @param url 
   * 
   * @memberof AppBaseService
   */
  displayToastMessage(response : any, url: any) {
    let statusText = response.statusText;
    if (response.status == 0 || response.status >= 300) {
      let message = "Oops something went wrong. Contact Admin";
      if (response.status == 409) {
        statusText = "Validation";
        if (response.error.message) message = response.error.message;
        else if (response.error.statusMessage)
          message = response.error.statusMessage;
        else message = response.error;
        this.toastr.info(message, statusText);
      } else if (response.status == 401) {
        statusText = "Unauthorized Access";
        message = "Invalid User Credentials";
        this.toastr.info(message, statusText);
      } else if (response.status == 503) {
        statusText = "RULE ENGINE ERROR";
        message = "Rule Engine is not accessible. Please contact DevOps Admin";
        this.toastr.info(message, statusText + " (" + response.status + ")");
      } else if (response.status == 0 && statusText == "Unknown Error") {
        statusText =  "Unknown ERROR";
        message = "Above microservice is down. Please contact DevOps Admin";
        this.toastr.error(message, statusText + " (404)");
      } else if (response.message && this.env.logMessages) {
        message = response.message;
        this.toastr.error(message, statusText + " (" + response.status + ")");
      }
    }
  }
}
