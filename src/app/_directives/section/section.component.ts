import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit,Output,EventEmitter} from '@angular/core';
import {HttpserviceService} from '../../_services/httpservice.service'
import {Template} from '../../_models/templateconfig'
import {Json} from '../../_configs/samplewi'

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
  providers : [HttpserviceService,Template],
})
export class SectionComponent implements OnInit {

  @Input() i:any;
  @Input() wid:any;
  @Input() section:any;
  @Input() section_id:any;
  @Output() notifyParent2: EventEmitter<any> = new EventEmitter();
  @Output() changeval: EventEmitter<any> = new EventEmitter();
  sec_edit = false;


  constructor(public HttpserviceService : HttpserviceService,public template : Template) { }
  ngOnInit() {
    this.template.steps = this.section.steps;
  }
  changeval2(e){
    this.changeval.emit(e)
  }
  getNotification(e){
    this.notifyParent2.emit(e);
  }
  toggle(){
    this.sec_edit = !this.sec_edit;
    if(!this.sec_edit){
      this.HttpserviceService.post('wi/'+this.wid+'/sec/'+this.section_id+'/upd/',
      {"section":{"order": 1,
      "t": this.section.t,
      "d": "this is description of section D in the test"}}
      ).subscribe(
        data => {
          this.HttpserviceService.post('wi/'+this.wid+'/0/get/',{}).subscribe(
            data => {
              this.changeval.emit()
            }
          )
        }
      )
    }
  }
  addsection(){
    this.HttpserviceService.post('wi/'+this.wid+'/sec/0/upd/',
    {"section":{"order": 1,
      "t": Json.section_title,
      "d": Json.section_description}
    }
    ).subscribe(
      ndata => {
        this.HttpserviceService.post('wi/'+this.wid+'/step/0/upd/',
        {"step":
        {"sec_id": ndata.data.id,"t":Json.step_title,
        "image": {
         "imageSrc": Json.images,
         "editedimg" : [],
        },
        "anott": "this is anottation json",
        "text": Json.text,
        "ref": {
          "t": []
        },
        "order": 1}}
        ).subscribe(
          data => {
            this.changeval.emit()
            this.HttpserviceService.post('wi/'+this.wid+'/ques/0/upd/',
            {"qsts":{"step_id":data.data.id,"qname": Json.qname,"qtype":Json.qtype,"qhlp":"help text for tool tip","mndt":true,"order":1,"options": Json.options}}
            ).subscribe(data => {
            this.HttpserviceService.post('wi/'+this.wid+'/0/get/',{}).subscribe(
              data => {
              })
            })
          }
        )
      }
    )
  }

}
