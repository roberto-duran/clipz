import {CommonModule} from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgxMaskModule} from "ngx-mask";

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxMaskModule
    ],
    standalone: true
})
export class InputComponent implements OnInit {
    @Input() control: FormControl = new FormControl()
    @Input() type = 'text'
    @Input() placeholder = ''
    @Input() format = ''
    constructor() {
    }

    ngOnInit(): void {
    }

}
