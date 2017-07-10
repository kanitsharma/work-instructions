import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import {DataTableModule} from "angular2-datatable";
import { FlexLayoutModule } from '@angular/flex-layout';
import {MdInputModule} from '@angular/material';
import {MdCardModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdCheckboxModule} from '@angular/material';
import {MdRadioModule} from '@angular/material';
import {MdSlideToggleModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import {MdIconModule} from '@angular/material';
import {MdSelectModule} from '@angular/material';
import {MdTooltipModule} from '@angular/material';
import {MdButtonToggleModule} from '@angular/material';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import {MdSliderModule} from '@angular/material';
import {MdDialogModule} from '@angular/material';

import { AppComponent } from './app.component';
import { FormcreatorComponent } from './_directives/formcreator/formcreator.component';
import { QboxComponent } from './_directives/qbox/qbox.component';
import { CardComponent } from './_directives/card/card.component';
import { SectionComponent } from './_directives/section/section.component';
import { StepComponent } from './_directives/step/step.component';
import { WiComponent } from './wi/wi.component';
import {SanitizeHtml} from './_directives/card/card.component';
import {Remove} from './_directives/card/card.component';
import { DataService } from './_services/data.service';
import { DatatableComponent } from './_directives/datatable/datatable.component';
import { CommentsComponent } from './_directives/comments/comments.component';

const routes: Routes = [
  { path: '', component: WiComponent },
  { path: 'wi', component: FormcreatorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FormcreatorComponent,
    QboxComponent,
    CardComponent,
    SectionComponent,
    StepComponent,
    WiComponent,
    DatatableComponent,
    SanitizeHtml,
    Remove,
    CommentsComponent
  ],
  entryComponents : [StepComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    MdInputModule,
    MdCardModule,
    MdButtonModule,
    MdCheckboxModule,
    MdRadioModule,
    MdSlideToggleModule,
    MdTabsModule,
    MdIconModule,
    MdSelectModule,
    MdTooltipModule,
    MdButtonToggleModule,
    Ng2PageScrollModule.forRoot(),
    MdSliderModule,
    MdDialogModule,
    RouterModule.forRoot(routes),
    DataTableModule,
  ],
  providers: [SanitizeHtml,DataService,Remove],
  bootstrap: [AppComponent],
})
export class AppModule { }
