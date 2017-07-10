import {Component, ViewChild, ElementRef, AfterViewInit , OnInit ,AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {HttpserviceService} from '../../_services/httpservice.service'
import {PageScrollConfig} from 'ng2-page-scroll';
import {Template} from '../../_models/templateconfig'
import {Json} from '../../_configs/samplewi'

import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/table';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';


@Component({
  selector: 'app-formcreator',
  templateUrl: './formcreator.component.html',
  styleUrls: ['./formcreator.component.css'],
  providers : [HttpserviceService , Template],
})
export class FormcreatorComponent implements OnInit {

  ji;si;counter = 0;counter2 =0;counter3 =0;counter4 =0;sectiontohighlight;tinyhtml;selectedt=[];selectedm=[];cm:Array<boolean>=[];ct:Array<boolean>=[];
  @ViewChild('outline') outline:ElementRef;
  @ViewChild('container') container:ElementRef;
  @ViewChild('sh') sh:ElementRef;
  @ViewChild('sh2') sh2:ElementRef;
  @ViewChild('sh3') sh3:ElementRef;
  @ViewChild('t1') t1:ElementRef;
  @ViewChild('t2') t2:ElementRef;
  @ViewChild('t3') t3:ElementRef;
  @ViewChild('h1') h1:ElementRef;
  @ViewChild('h2') h2:ElementRef;
  @ViewChild('h3') h3:ElementRef;

  constructor(public HttpserviceService : HttpserviceService, private route: ActivatedRoute,
    private router: Router , public template : Template ) {

    PageScrollConfig.defaultScrollOffset = 100;
    PageScrollConfig.defaultEasingLogic = {
      ease: (t: number, b: number, c: number, d: number): number => {
          // easeInOutExpo easing
          if (t === 0) return b;
          if (t === d) return b + c;
          if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
          return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    }
  }
  collapse(){
    if(this.counter == 0){
      this.outline.nativeElement.classList.add('collapse');
      this.container.nativeElement.classList.add('move');
      this.counter++;
    }
    else{
      this.outline.nativeElement.classList.remove('collapse');
      this.container.nativeElement.classList.remove('move');
      this.counter--;
    }
  }
  delete(sec_id){
    this.HttpserviceService.post('wi/'+this.template.wid+'/sec/'+ sec_id + '/del/',{}).subscribe(
      data => {
        this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
          data => {
            this.template.sections = data.sections;
          }
        )
      }
    )
  }
  deletestep(step_id){
    this.HttpserviceService.post('wi/'+this.template.wid+'/step/'+ step_id + '/del/',{}).subscribe(
      data => {
        this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
          data => {
            this.template.sections = data.sections;
          }
        )
      }
    )

  }
  addstep(i){
    this.HttpserviceService.post('wi/'+this.template.wid+'/step/0/upd/',
    {"step":
    {"sec_id": i,"t" : Json.step_title,
    "image": {
     "imageSrc": Json.images,
     "editedimg" : [],
    },
    "anott": [],
    "text": Json.text,
    "ref": {
      "t": []
    },
    "order": 1}}
  ).subscribe(
    data => {
      this.HttpserviceService.post('wi/'+this.template.wid+'/ques/0/upd/',
      {"qsts":{"step_id":data.data.id,"qname": Json.qname,"qtype":Json.qtype,"qhlp":"help text for tool tip","mndt":true,"order":1,"options": Json.options}}
    ).subscribe( data => {
      this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
        data => {
          this.template.sections = data.sections;
        }
      )
    })
    }
  )
  }
  getNotification(e){
    this.ji = e.section;
    this.si = e.step;

  }
  changeval(){
    setTimeout(()=> {
      this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
        data => {
          this.template.sections = data.sections;
        }
      )
    },100)
  }
  add(){
    this.HttpserviceService.post('wi/'+this.template.wid+'/sec/0/upd/',
    {"section":{"order": 1,
      "t": Json.section_title,
      "d": Json.section_description}

    }
    ).subscribe(
      ndata => {
        this.HttpserviceService.post('wi/'+this.template.wid+'/step/0/upd/',
        {"step":
        {"sec_id": ndata.data.id,"t":Json.step_title,
        "image": {
         "imageSrc": Json.images,
         "editedimg" : [],
        },
        "anott": [],
        "text": Json.text,
        "ref": {
          "t": []
        },
        "order": 1}}
        ).subscribe(
          kdata => {
            this.HttpserviceService.post('wi/'+this.template.wid+'/ques/0/upd/',
            {"qsts":{"step_id": kdata.data.id,"qname":Json.qname,"qtype":Json.qtype,"qhlp":"help text for tool tip","mndt":true,"order":1,"options":Json.options}}
          ).subscribe(data => {
            this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
              data => {
                this.template.sections = data.sections;
              }
            )
          })
          }
        )
      }
    )
  }
  show(){
    if(this.counter2 == 0){
      this.sh.nativeElement.classList.add('show');
      this.counter2++;
    }
    else{
      this.sh.nativeElement.classList.remove('show');
      this.counter2--;
    }
  }
  show2(){
    if(this.counter3 == 0){
      this.sh2.nativeElement.classList.add('show');
      this.counter3++;
    }
    else{
      this.sh2.nativeElement.classList.remove('show');
      this.counter3--;
    }
  }
  show3(){
    if(this.counter4 == 0){
      this.sh3.nativeElement.classList.add('show');
      this.counter4++;
    }
    else{
      this.sh3.nativeElement.classList.remove('show');
      this.counter4--;
    }
  }
  ngAfterViewInit(){
    tinymce.init({
      selector: 'textarea',
      min_height: 165,
      max_width : 700,
      resize : false,
      plugins: [
        'advlist lists  ',
        'colorpicker textcolor',
      ],
      menubar : false,
      toolbar1: 'undo redo | bold italic | alignleft aligncenter alignright  alignjustify | bullist numlist | forecolor ',
      skin_url: 'assets/skins/lightgray',
      content_css: [
        '//fonts.googleapis.com/css?family=Lato:300i,400',
        '//www.tinymce.com/css/codepen.min.css'
      ],
      init_instance_callback: function (editor) {

        editor.on('Blur', function (e) {
          if(tinymce.activeEditor.getContent() == ''){
            this.t1.nativeElement.classList.add("opace");
            this.h1.nativeElement.classList.add("opace");
          }
          this.HttpserviceService.post('wi/'+this.template.wid+'/upd/',
            {"instr":{ "preq":{"text": tinymce.activeEditor.getContent()}}}).subscribe(
            data => {
              this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
                data => {
                  this.template.sections = data.sections;
                }
              );
            })
          }.bind(this));
        }.bind(this)
      });
  }
  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.template.wid = params['wi_id'];
    });
    this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
      (data)=>{
        console.log(data)
        this.template.wi = data;
        this.template.title = data.title;
        this.template.sections = data.sections;
        this.selectedt = data.lot;
        this.selectedm = data.lom;
        this.selectedt.map( data=> {
          this.ct[data] = !this.ct[data];
        } )
        if(data.lot.length == 0){
          this.t3.nativeElement.classList.add("opace");
          this.h3.nativeElement.classList.add("opace");
        }
        this.selectedm.map( data=> {
          this.cm[data] = !this.cm[data];
        } )
        if(data.lom.length == 0){
          this.t2.nativeElement.classList.add("opace");
          this.h2.nativeElement.classList.add("opace");
        }
        tinymce.activeEditor.setContent(data.preq.text);
        if(data.preq.text == ''){
          this.t1.nativeElement.classList.add("opace");
          this.h1.nativeElement.classList.add("opace");
        }
        if(this.template.sections.length == 0){
            this.HttpserviceService.post('wi/'+this.template.wid+'/sec/0/upd/',
            {"section":{"order": 1,
              "t": Json.section_title,
              "d": Json.section_description}

            }
            ).subscribe(
              ndata => {
                this.HttpserviceService.post('wi/'+this.template.wid+'/step/0/upd/',
                {"step":
                {"sec_id": ndata.data.id,"t": Json.step_title,
                "image": {
                 "imageSrc": Json.images,
                 "editedimg" : [],
                },
                "anott": [],
                "text": Json.text,
                "ref": {
                  "t": []
                },
                "order": 1}}
                ).subscribe(
                  data => {
                    this.HttpserviceService.post('wi/'+this.template.wid+'/ques/0/upd/',
                    {"qsts":{"step_id":data.data.id,"qname": Json.qname,"qtype":Json.qtype,"qhlp":"help text for tool tip","mndt":true,"order":1,"options": Json.options}}
                  ).subscribe(data => {
                    this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
                      data => {
                        this.template.sections = data.sections;
                      }
                    )
                  })

                  }
                )
              }
            )
        }
      }
    );
    this.HttpserviceService.get('tools').subscribe((data)=> {
      this.template.tools = data.data
    })
    this.HttpserviceService.get('materials').subscribe((data)=> {
      this.template.materials = data.data;
    })
  }
  selectt(value){

    this.ct[value]=!this.ct[value]
    if(this.ct[value]){
      this.selectedt.push(value)
      this.HttpserviceService.post('wi/'+this.template.wid+'/upd/',
      {"instr":{ "lot":this.selectedt}}).subscribe( data => {
        this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
          data => {
          }
        )
      })
    }

    else{
      var rem = this.selectedt.indexOf(value);
      this.selectedt.splice(rem,1);
      this.HttpserviceService.post('wi/'+this.template.wid+'/upd/',
      {"instr":{ "lot":this.selectedt}}).subscribe( data => {
        this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
          data => {
          }
        )
      })
    }
    if(this.selectedt.length == 0){
      this.t3.nativeElement.classList.add("opace");
      this.h3.nativeElement.classList.add("opace");
    }
    else{
      this.t3.nativeElement.classList.remove("opace");
      this.h3.nativeElement.classList.remove("opace");
    }
  }
  selectm(value){
    this.cm[value]=!this.cm[value];

    if(this.cm[value]){
      this.selectedm.push(value)
      console.log(this.selectedm)
      this.HttpserviceService.post('wi/'+this.template.wid+'/upd/',
      {"instr":{ "lom":this.selectedm}}).subscribe( data => {
        this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
          data => {
          }
        )
      })
    }

    else{
      var rem = this.selectedm.indexOf(value);
      this.selectedm.splice(rem,1);
      this.HttpserviceService.post('wi/'+this.template.wid+'/upd/',
      {"instr":{ "lom":this.selectedm}}).subscribe( data => {
        this.HttpserviceService.post('wi/'+this.template.wid+'/0/get/',{}).subscribe(
          data => {
          }
        )
      })
    }

    if(this.selectedm.length != 0){
      this.t2.nativeElement.classList.remove("opace");
      this.h2.nativeElement.classList.remove("opace");
    }
    else{
      this.t2.nativeElement.classList.add("opace");
      this.h2.nativeElement.classList.add("opace");
    }
  }

}
