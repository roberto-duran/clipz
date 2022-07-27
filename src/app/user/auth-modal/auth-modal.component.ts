import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {SharedModule} from "../../shared/shared.module";
import {LoginComponent} from "../login/login.component";
import {RegisterComponent} from "../register/register.component";

@Component({
    selector: 'app-auth-modal',
    templateUrl: './auth-modal.component.html',
    styleUrls: ['./auth-modal.component.scss'],
    imports: [
        CommonModule,
        SharedModule,
        LoginComponent,
        RegisterComponent
    ],
    standalone: true
})
export class AuthModalComponent implements OnInit, OnDestroy {
    private authModalName: string = 'auth'

    constructor(public modal: ModalService) {
    }

    ngOnInit(): void {
        this.modal.register(this.authModalName);
    }

    ngOnDestroy() {
        this.modal.unregister(this.authModalName);
    }

}
