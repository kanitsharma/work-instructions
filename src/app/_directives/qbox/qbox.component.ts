import { Component,ViewChild, ElementRef, AfterViewInit , OnInit , Input , OnDestroy } from '@angular/core';
import {HttpserviceService} from '../../_services/httpservice.service'
import {Template} from '../../_models/templateconfig';
import {MdSliderModule} from '@angular/material';

@Component({
  selector: 'app-qbox',
  templateUrl: './qbox.component.html',
  styleUrls: ['./qbox.component.css'],
  providers : [HttpserviceService]
})
export class QboxComponent implements OnInit {

  @Input() qno: any;
  @Input() step : any;
  @Input() section : number;
  @Input() menuhide : any;
  @Input() logichide : any;
  @Input() wid : any;
  @ViewChild('open') op:ElementRef;

  selectedValue;
  options = [ 'Slider','Multiple Choice' , 'Number', 'Textbox'];
  qtypes = ['slider','radio','num','text'];
  sections;
  count = 0;
  down = 'keyboard_arrow_down'
  constructor( public template:Template , public HttpserviceService : HttpserviceService) { }
  public trackByIndex(index: number, item) {
  return index;
}

  openme(){

    if(this.count == 0){
      this.op.nativeElement.classList.add('new');
      this.down = 'keyboard_arrow_up';
      this.count++;
    }
    else{
      this.op.nativeElement.classList.remove('new');
      this.down = 'keyboard_arrow_down';
      this.count--;
    }
  }

  qtypefun(){
    this.qno.qtype = this.selectedValue;
    if(this.selectedValue == 'radio' ){
      this.qno.options = ["sample","sample","sample"];
      this.HttpserviceService.post('wi/'+this.wid+'/ques/'+this.qno.qid+'/upd/',
      {"qsts":{"step_id": this.step.step_id,"qname":"Question 1","qtype":"radio","qhlp":"help text for tool tip","mndt":true,"order":1,"options":["sample","sample","sample"]}}
    ).subscribe( data => {
    });
    }
    if(this.selectedValue == 'num' ){
      this.qno.options = {"min":10,"max":100,"prec":"0.02d"};
      this.HttpserviceService.post('wi/'+this.wid+'/ques/'+this.qno.qid+'/upd/',
      {"qsts":{"step_id": this.step.step_id,"qname":"Question 1","qtype":"radio","qhlp":"help text for tool tip","mndt":true,"order":1,"options":{"min":10,"max":100,"prec":"0.02d"}}}
    ).subscribe( data => {
    });
    }
    if(this.selectedValue == 'slider' ){
      this.qno.options = {"min":10,"max":100,"prec":"0.02d","showthumb":false};
      this.HttpserviceService.post('wi/'+this.wid+'/ques/'+this.qno.qid+'/upd/',
      {"qsts":{"step_id": this.step.step_id,"qname":"Question 1","qtype":"radio","qhlp":"help text for tool tip","mndt":true,"order":1,"options":{"min":10,"max":100,"prec":"0.02d","showthumb":false}}}
    ).subscribe( data => {
    });
    }
    if(this.selectedValue == 'text' ){
      this.qno.options = {"min":10,"max":100,"prec":"0.02d"};
      this.HttpserviceService.post('wi/'+this.wid+'/ques/'+this.qno.qid+'/upd/',
      {"qsts":{"step_id": this.step.step_id,"qname":"Question 1","qtype":"radio","qhlp":"help text for tool tip","mndt":true,"order":1,"options":{"min":10,"max":100,"prec":"0.02d"}}}
    ).subscribe( data => {
    });
    }
  }

  add(){
    let counter = 0;
    this.qno.options.map(data => {
      counter ++;
    })
    this.qno.options.push("");
  }
  minus(){
    let counter = 0;
    this.qno.options.map(data => {
      counter ++;
    })
    this.qno.options.splice( counter-1 , 1 );
  }
  ngOnInit() {
    this.selectedValue = this.qno.qtype;
    this.HttpserviceService.post('wi/'+this.wid+'/0/get/',{}).subscribe(
      data => {
        this.sections = data.sections
      }
    )
  }
  ngOnDestroy(){
    this.HttpserviceService.post('wi/'+this.wid+'/ques/'+this.qno.qid+'/upd/',
    {"qsts":{"step_id":this.step.step_id,"qname": this.qno.qname,"qtype":this.qno.qtype,"qhlp":"help text for tool tip","mndt":true,"order":1,"options": this.qno.options}}
  ).subscribe(data => {
  })
  }


}
