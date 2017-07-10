import { Component, OnInit,Input } from '@angular/core';
import {HttpserviceService} from '../../_services/httpservice.service'

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  providers:[HttpserviceService]
})
export class CommentsComponent implements OnInit {

  @Input() step ;
  @Input() wid ;

  comments = {
    lvl1 : [],
  };
  replylvl1 ={};replylvl2={};replylvl3={};replylvl4 = {};
  comment;

  constructor(public HttpserviceService : HttpserviceService ) { }

  ngOnInit() {
    this.HttpserviceService.post("comments/get",{"elem":"step","eid":this.step.step_id}).subscribe( data => {
      this.comments.lvl1 = data.data.comments.slice();
    })
  }

  submitcomment(e){
    var count = 0;
    this.comments.lvl1.map( data => {
      if(data.stat != "r"){
        count++;
      }
    })
    console.log(count)
    if(count>2){
      alert("Maximum Unresolved Comments Limit Reached")
    }
    else{
      this.HttpserviceService.post("comments/add/",{"elem":"step","eid":this.step.step_id,"text" : this.comment , "path":[]}).subscribe( data => {
        this.HttpserviceService.post("comments/get",{"elem":"step","eid":this.step.step_id}).subscribe( data => {
          this.comments.lvl1 = data.data.comments.slice();
        })
      })
      this.comment = '';
    }
  }
  submitr1(e,text){
    this.HttpserviceService.post("comments/add/",{"elem":"step","eid":this.step.step_id,"text" : text , "path":[e]}).subscribe( data =>{
      this.HttpserviceService.post("comments/get",{"elem":"step","eid":this.step.step_id}).subscribe( data => {
        this.comments.lvl1 = data.data.comments.slice();
      })
    }
  );
    console.log(e)
  }
  submitr2(u,e,text){
    this.HttpserviceService.post("comments/add/",{"elem":"step","eid":this.step.step_id,"text" : text , "path":[u,e]}).subscribe( data =>{
      this.HttpserviceService.post("comments/get",{"elem":"step","eid":this.step.step_id}).subscribe( data => {
        this.comments.lvl1 = data.data.comments.slice();
      })
    }
  );
  }
  submitr3(u,e,i,text){
    this.HttpserviceService.post("comments/add/",{"elem":"step","eid":this.step.step_id,"text" : text , "path":[u,e,i]}).subscribe( data =>{
      this.HttpserviceService.post("comments/get",{"elem":"step","eid":this.step.step_id}).subscribe( data => {
        this.comments.lvl1 = data.data.comments.slice();
      })
    }
  );
  }
  submitr4(u,e,i,j,text){
    this.HttpserviceService.post("comments/add/",{"elem":"step","eid":this.step.step_id,"text" : text , "path":[u,e,i,j]}).subscribe( data =>{
      this.HttpserviceService.post("comments/get",{"elem":"step","eid":this.step.step_id}).subscribe( data => {
        this.comments.lvl1 = data.data.comments.slice();
      })
    }
  );
  }
  resolve(i){
    this.HttpserviceService.post("comments/status",{"elem":"step","eid":this.step.step_id,"status":"r","path":[i]}).subscribe( data => {
      this.HttpserviceService.post("comments/get",{"elem":"step","eid":this.step.step_id}).subscribe( data => {
        this.comments.lvl1 = data.data.comments.slice();
      })
    })
  }

}
