import {Component, ViewChild, ElementRef, AfterViewInit , OnInit , Input , Output , EventEmitter, Pipe,PipeTransform , Injectable} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MdDialogRef, MdDialog} from '@angular/material';
import { StepComponent } from '../step/step.component';
import {HttpserviceService} from '../../_services/httpservice.service'
import {Template} from '../../_models/templateconfig'
import {Json} from '../../_configs/samplewi'

import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/paste';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  providers : [Template,HttpserviceService],

})
export class CardComponent implements OnInit {

  @Input() step ;
  @Input() instruction:any;
  @Input() section : any;
  @Input() i : any;
  @Input() wid:any;
  @Input() steps : any;
  @Input() si : any;
  @Input() section_id:string;
  @ViewChild('full') full:ElementRef;
  @ViewChild('but') but:ElementRef;
  @ViewChild('slider') slider:ElementRef;
  @ViewChild('s') s:ElementRef;
  @ViewChild('fl') fl:ElementRef;
  @ViewChild('toggle') toggle:ElementRef;
  @ViewChild('seco') group:ElementRef;
  @ViewChild('commentp') cmt:ElementRef;
  @ViewChild('overlay') overlay:ElementRef;
  editor;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  @Output() changeval: EventEmitter<any> = new EventEmitter();
  imageSrc = [];
  uploadimg = [];
  showimg=[];
  question_numbers;
  tinyhtml:string;
  jsons=[];
  counter = 0;
  menuhide = true;
  logichide=true;
  counter2 = 0;
  translate = 0;
  currentimage = 1;
  counter3 = 0;
  newques;
  showtiny = true;
  questionc=false;
  referencec = false;
  files=[];
  comments=[];
  dialogRef : MdDialogRef<any>;

  constructor(public dialog: MdDialog,public HttpserviceService : HttpserviceService , public template : Template ) {

  }

  addstep(){
    this.HttpserviceService.post('wi/'+this.wid+'/step/0/upd/',
    {"step":
    {"sec_id": this.section_id,"t":Json.step_title,
    "image": {
     "imageSrc": Json.images,
     "editedimg" : [],
    },
    "editedimage" : [],
    "anott": [],
    "text": Json.text,
    "ref": {
      "t": []
    },
    "order": 1}}
  ).subscribe(
    data => {
      this.HttpserviceService.post('wi/'+this.wid+'/ques/0/upd/',
      {"qsts":{"step_id": data.data.id,"qname": Json.qname,"qtype":Json.qtype,"qhlp":"help text for tool tip","mndt":true,"order":1,"options":Json.options}}
      ).subscribe( data => {
        this.changeval.emit();
      })
    }
  )
  }
  rem(){
    this.menuhide=true;
    this.full.nativeElement.classList.remove('fullcard');
  }
  editimg(){
    this.dialogRef = this.dialog.open(StepComponent);
    this.dialogRef.componentInstance.imageSrc = this.imageSrc;
    this.dialogRef.componentInstance.jsons = this.jsons;
    this.dialogRef.componentInstance.editedimg = this.uploadimg;
    this.dialogRef.componentInstance.showimg = this.showimg;
  }
  offClickHandler(event:any) {
    this.edit()
  }
  edit(){
    if(this.counter2 == 0){
      this.counter2++;
      this.full.nativeElement.classList.add('fullcard');
      this.toggle.nativeElement.classList.add('butuntoggle');
      this.cmt.nativeElement.classList.add('tt');
      this.menuhide = false;
      this.translate=0;
      this.currentimage=1;

    }
    else{
      if(this.counter3 > 0){
        this.counter3=0;
        this.showtiny = true;
      }
      this.counter2--;
      this.full.nativeElement.classList.remove('fullcard');
      this.toggle.nativeElement.classList.remove('butuntoggle');
      this.cmt.nativeElement.classList.remove('tt');
      this.menuhide = true;
      this.translate=0;
      this.currentimage=1;
      this.HttpserviceService.post('wi/'+this.wid+'/step/'+this.step.step_id+'/upd/',
      {"step":{"sec_id": this.section_id ,"t": this.step.t,
      "image": {
       "imageSrc": this.imageSrc,
       "editedimg" : this.uploadimg,
      },
      "anott": this.jsons,
      "text": this.tinyhtml,
      "ref": {
        "t": this.files
      },
      "order": 1}}
    ).subscribe(
      data => {
      }
    )
    }
    this.notifyParent.emit({'section' : this.i , 'step' : this.si});
  }
  moveleft(){
    if(this.currentimage > 1){
      this.translate += 16;
      this.slider.nativeElement.style.transform=`translate(${this.translate}vw)`
      this.currentimage--;
    }
  }
  moveright(){
    if(this.currentimage < this.imageSrc.length){
      this.translate -= 16;
      this.slider.nativeElement.style.transform=`translate(${this.translate}vw)`
      this.currentimage++;
    }
  }
  logic(){
    if(this.counter == 0){
      this.counter++;
      this.logichide = false;
    }
    else{
      this.counter--;
      this.logichide = true;
    }
  }
  delete(i){
    this.HttpserviceService.post('wi/'+this.wid+'/ques/'+i.qid+'/del/',{}).subscribe(
      data => {
        this.changeval.emit()
      }
    )
  }
  addnew(){
    this.HttpserviceService.post('wi/'+this.wid+'/ques/0/upd/',
    {"qsts":{"step_id": this.step.step_id,"qname": Json.qname,"qtype":Json.qtype,"qhlp":"help text for tool tip","mndt":true,"order":1,"options":Json.options}}
  ).subscribe( data => {
    this.changeval.emit()
  })
  }
  ngOnInit() {
    this.question_numbers = this.step.qsts;
    this.tinyhtml = this.step.text;
    this.jsons = this.step.anott;
    this.imageSrc = this.step.image.imageSrc;
    this.uploadimg = this.step.image.editedimg;
    this.files = this.step.ref.t.slice();
    if(this.step.image.editedimg.length!=0){
      this.showimg = this.step.image.editedimg.slice()
    }
    else{
      this.showimg = this.step.image.imageSrc.slice()
    }
    this.HttpserviceService.post("comments/get",{"elem":"step","eid":this.step.step_id}).subscribe( data => {
      this.comments = data.data.comments.slice();
    })
  }

  newfile(){
    if(this.fl.nativeElement.value == ''){
      alert("Enter the link first");
    }
    else{
      this.files.push(this.fl.nativeElement.value);
    }
  }

  tinyedit(){
    if(this.counter3 == 0){
      this.counter3++;
      this.showtiny = false;
      tinymce.init({
        selector: '.tinymce',
        min_height: 165,
        max_width : 700,
        paste_as_text: true,
        resize : false,
        plugins: [
          'advlist lists paste',
          'colorpicker textcolor',
        ],
        menubar : false,
        toolbar1: 'undo redo | bold italic | bullist numlist | forecolor ',
        skin_url: 'assets/skins/lightgray',
        content_css: [
         '//fonts.googleapis.com/css?family=Roboto:300',
         './assets/tinymce.css'],
        init_instance_callback: function (editor) {
          editor.on('keyup', function (e) {
            this.tinyhtml = tinymce.activeEditor.getContent().toString();
          }.bind(this));
        }.bind(this)
      });
    }
    else{
      this.counter3=0;
      this.showtiny = true;
    }
  }
}
@Pipe({
    name: 'sanitizeHtml'
})
export class SanitizeHtml implements PipeTransform  {

   constructor(private _sanitizer: DomSanitizer){}

   transform(v: string) : SafeHtml {
      return this._sanitizer.bypassSecurityTrustHtml(v);
   }
}

@Pipe({
	name : "remove"
})
export class Remove implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
