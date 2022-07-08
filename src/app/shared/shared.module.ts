import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent} from './modal/modal.component';
import { TabContainerComponent } from './tab-container/tab-container.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NgxMaskModule} from "ngx-mask";
import { AlertComponent } from './alert/alert.component';

@NgModule({
    declarations: [
        ModalComponent,
        TabContainerComponent,
        TabComponent,
        InputComponent,
        AlertComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot()
    ],
    exports: [
        ModalComponent,
        TabContainerComponent,
        TabComponent,
        InputComponent,
        AlertComponent
    ]
})
export class SharedModule {
}
