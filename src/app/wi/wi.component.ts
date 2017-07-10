import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {HttpserviceService} from '../_services/httpservice.service'
import {Tdata} from '../_configs/tabledata.config'
import {Json} from '../_configs/samplewi'

@Component({
  selector: 'app-wi',
  templateUrl: './wi.component.html',
  styleUrls: ['./wi.component.css'],
  providers : [HttpserviceService],
})
export class WiComponent implements OnInit {

  data;
  gg=false;
  title;description;
  tableData;
  @ViewChild('overlay') overlay:ElementRef;
  @ViewChild('sidebar') sidebar:ElementRef;

  constructor(public HttpserviceService : HttpserviceService,private route: ActivatedRoute,
    private router: Router ) { }

  ngOnInit() {
    this.HttpserviceService.post('wi/all/',{}).subscribe(
      (data)=>{
        this.data = data.data;
      }
    );
    this.tableData = Tdata;
  }
  add(){
    this.overlay.nativeElement.classList.add('unhide');
    this.sidebar.nativeElement.classList.add('view');
  }
  delete(wid){
    this.HttpserviceService.post('wi/'+wid+'/del/',{}).subscribe(
      data => {
        this.HttpserviceService.post('wi/all/',{}).subscribe(
          (data)=>{
            this.data = data.data;
          }
        );
      }
    )
  }
  hide(){
    this.overlay.nativeElement.classList.remove('unhide');
    this.sidebar.nativeElement.classList.remove('view');
  }
  addwi(){
    this.HttpserviceService.post('wi/0/upd/',
    {"instr":{ "title": this.title,"desc": this.description ,"preq":{"text": Json.prerequistes},"lom":[],"lot":[]},sections:[]}).subscribe(
    data => {
      this.HttpserviceService.post('wi/all/',{}).subscribe(
        (data)=>{
          this.data = data.data;
        }
      );
    }
  )
  this.hide()
  }
  navigate(id){
    this.router.navigate(['/wi'], { queryParams: { wi_id: id } });
  }

}
