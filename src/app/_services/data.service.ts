import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { keys as _keys } from 'underscore';

import 'rxjs/add/operator/map';


@Injectable()
export class DataService {

  private baseUrl: string;

  constructor(private http: Http) {
    this.baseUrl = 'http://api.clytics.com/manage';
  }

  fetchTableData(link: string, params: any = {}): Observable<any> {
    return this.get(link, params);
  }

  fetchTableItem(id: string, link: string): Observable < any > {
    return this.get(link, {
      _id: id
    });
  }

  createTableItem(item: any, link: string) {
      this
        .post(link, item)
        .subscribe(response => {
          if (response.success === false) {
            console.log(response);
          }
        }, error => console.log('Could not create product item.'));
  }

  updateTableItem(item: any, link: string) {
      this
        .post(link, item)
        .subscribe(response => {
          if (response.success === false) {
            console.log(response);
          }
        }, error => console.log('Could not update product item.'));
  }

  deleteTableItem(item: any, link: string) {
       this
        .post(link, item)
        .subscribe(response => {
          if (response.success) {
            window.location.reload();
          } else {
            console.log(response);
          }
        }, error => console.log('Could not delete product item.'));
  }

  downloadReference(link: string, params: any = {}): Observable < any > {
    return this
      .http
      .get(link, params)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  executeBatchUpdateAction(batchData: any, keyPath: string, selectedIds: string[], fetchLink: string, updateLink: string) {
    let batchItem: any, batchObject: any, batchPath, batchCount = 0;
    selectedIds.forEach((id) => {
      this
        .get(fetchLink, {
          _id: id
        })
        .subscribe(fetchResponse => {
          if (fetchResponse.success) {
            batchItem = Object.assign({}, fetchResponse).data;
            batchObject = batchItem;
            batchPath = keyPath.split('.');
            while (batchPath.length !== 1) {
              batchObject = batchObject[batchPath.shift()];
            }
            batchObject[batchPath.shift()] = batchData;
            this
              .post(updateLink, batchItem)
              .subscribe(updateResponse => {
                if (updateResponse.success) {
                  batchCount = batchCount + 1;
                } else {
                  console.log(updateResponse);
                }
                if (batchCount === selectedIds.length) {
                   window.location.reload();
                }
              }, error => console.log('Could not update product item.'));
          } else {
            console.log(fetchResponse);
          }
        }, error => console.log('Could not fetch product item.'));
    });
  }


  post(path: string = 'users/create/', body: any, ) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const options = new RequestOptions({
      headers: headers
    });
    const json = 'json=' + JSON.stringify(body);
    return this.http.post(this.baseUrl + path, json, options)
      .map((res: Response) => { return res.json(); })
      .catch(this.handleError);
  }

  get(path: string = 'departments/all/', params: any = {}) {
    const keys = _keys(params);
    let query = '?';
    for (let i = 0; i < keys.length; i++) {
      query = query + keys[i] + '=' + params[keys[i]] + '&';
    }
    return this.http.get(this.baseUrl + path + query)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

}
