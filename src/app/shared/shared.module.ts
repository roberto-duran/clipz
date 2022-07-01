import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent} from './modal/modal.component';
import { TabContainerComponent } from './tab-container/tab-container.component';
import { TabComponent } from './tab/tab.component';


@NgModule({
    declarations: [
        ModalComponent,
        TabContainerComponent,
        TabComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ModalComponent,
        TabContainerComponent,
        TabComponent
    ]
})
export class SharedModule {
}
