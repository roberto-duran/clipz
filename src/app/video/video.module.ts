import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import {InputComponent} from "../shared/input/input.component";
import {AlertComponent} from "../shared/alert/alert.component";

@NgModule({
  declarations: [
    ManageComponent,
    UploadComponent,
    EditComponent,
    SafeUrlPipe
  ],
    imports: [
        CommonModule,
        VideoRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        InputComponent,
        AlertComponent
    ]
})
export class VideoModule { }
