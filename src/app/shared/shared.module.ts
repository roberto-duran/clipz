import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabContainerComponent } from './tab-container/tab-container.component';
import { TabComponent } from './tab/tab.component';
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMaskModule } from "ngx-mask";
import { EventBlockerDirective } from './directives/event-blocker.directive';
import {InputComponent} from "./input/input.component";
import {AlertComponent} from "./alert/alert.component";

@NgModule({
    declarations: [
        ModalComponent,
        TabContainerComponent,
        TabComponent,
        EventBlockerDirective
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        InputComponent,
        AlertComponent
    ],
    exports: [
        ModalComponent,
        TabContainerComponent,
        TabComponent,
        EventBlockerDirective
    ]
})
export class SharedModule {
}
