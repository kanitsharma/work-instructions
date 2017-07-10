import { Injectable } from '@angular/core';

@Injectable()
export class LocalstorageService {

  constructor() { }

  store(key,data){
    localStorage.setItem(key,data);
  }
  storesnapshot(snapshot){
    localStorage.setItem('snapshot',snapshot);
  }
  storeimage(image,key){
    localStorage.setItem(key,image);
  }
  storesteps(steps){
    localStorage.setItem('steps',steps);
  }

}
