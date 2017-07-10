import { Component, OnInit, ViewChild , ElementRef , AfterViewInit,EventEmitter,OnDestroy } from '@angular/core';
import {HttpserviceService} from '../../_services/httpservice.service'

declare var LC : any;


@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css'],
  providers : [HttpserviceService],
})
export class StepComponent implements OnInit {

  lc;
  @ViewChild('canvas') el:ElementRef;
  @ViewChild('inp') inp:ElementRef;
  @ViewChild('file') file:ElementRef;
  index;
  jsons = [];
  imageSrc;
  editedimg=[];
  showimg=[];

  constructor(public HttpserviceService:HttpserviceService) { }

  ngOnInit() {
    console.log(this.imageSrc)
    console.log(this.editedimg)
    console.log(this.jsons)
  }
  changeimg(index){
    this.index = index;
    var backgroundImage = new Image();
    backgroundImage.setAttribute('crossOrigin', 'anonymous');
    backgroundImage.src = this.imageSrc[index];
    this.lc = LC.init(
     this.el.nativeElement,
     {imageURLPrefix: 'assets/img',
     backgroundShapes: [
      LC.createShape(
        'Image', {x: 0, y: 0, image: backgroundImage}),
     ],
      tools: [LC.tools.Pencil, LC.tools.Eraser, LC.tools.Line, LC.tools.Rectangle, LC.tools.Ellipse, LC.tools.Polygon, LC.tools.Text, LC.tools.Pan, LC.tools.SelectShape,LC.tools.Eyedropper],
   },
   LC.tools.SelectShape.prototype.iconName = 'select',
   );
   if(this.jsons[this.index]){
     this.lc.loadSnapshot(this.jsons[this.index])
   }
   this.lc.on('drawingChange', function() {
     this.jsons[this.index] = this.lc.getSnapshot(['shapes', 'colors']);
     this.editedimg[this.index] = this.lc.getImage().toDataURL();
     this.showimg[this.index] = this.lc.getImage().toDataURL();
     this.editedimg.map( (file,index) => {
       this.uploadedited(file,index);
     } )

   }.bind(this))
  }
  updateimg(index){
    if(this.jsons[index]){
      this.lc.loadSnapshot(this.jsons[index])
      this.editedimg[index] = this.lc.getImage().toDataURL();
    }

  }
  ngAfterViewInit(){
    this.lc = LC.init(
     this.el.nativeElement,
     {imageURLPrefix: 'assets/img',
   }
   );
  }
  uploadimage(){
    this.inp.nativeElement.click();
  }
  upload(file){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
      this.HttpserviceService.get('image/get/?file_hash='+JSON.parse(xhr.responseText).data.name).subscribe( data => {
        this.imageSrc.push(JSON.parse(xhr.responseText).data.path)
        this.showimg.push(JSON.parse(xhr.responseText).data.path)
      } )
    }.bind(this)
    xhr.open ('POST', 'http://api.clytics.com/manage/image/upload/', true);
    let frm = new FormData();
    frm.append("nfile",file)
    xhr.send(frm)
  }
  uploadedited(file,i){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
      this.HttpserviceService.get('image/get/?file_hash='+JSON.parse(xhr.responseText).data.name).subscribe( data => {
        this.editedimg[i]=JSON.parse(xhr.responseText).data.path;
      } )
    }.bind(this)
    xhr.open ('POST', 'http://api.clytics.com/manage/image/uploadblob/', true);
    let frm = new FormData();
    frm.append("nfile",file)
    xhr.send(frm)
  }

  handleInputChange(e) {
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!this.file.nativeElement.files[0].type.match(pattern)) {
        alert('invalid format');
        return;
    }
    else{
        this.upload(this.file.nativeElement.files[0])
    }
  }

  del(i){
    this.imageSrc.splice(i,1);
    this.showimg.splice(i,1);
    this.jsons.splice(i,1);
    this.changeimg(i-1);
  }
  ngOnDestroy(){
  }
}
