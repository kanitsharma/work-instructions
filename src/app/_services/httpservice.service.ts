import { Injectable } from '@angular/core';
import { Http, Response,  RequestOptions, Headers  } from '@angular/http';
import {Setting} from '.././_configs/appsetting'
import 'rxjs/add/operator/map';

@Injectable()
export class HttpserviceService {

  constructor( private http : Http ) { }
  basepath = Setting.basepath;

  fetchData() {
    return this.http.get('assets/samplewi.json')
    .map((res:Response) => res.json());
  }
  fetchInstruction() {
    return this.http.get('assets/instruction.json')
    .map((res:Response) => res.json());
  }
  post(path : string , body : any){
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({
      headers: headers
    });
    body.TOKEN = Setting.token;
    let json = 'json=' + JSON.stringify(body)
    return this.http.post(this.basepath + path, json, options)
    .map((res: Response) => {
      return res.json();
    })
  }
  get(path : string){
    return this.http.get(this.basepath + path)
    .map((res:Response) => res.json());
  }
}
