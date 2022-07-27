import {CommonModule} from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    imports: [
        CommonModule,
        NgClass
    ],
    standalone: true
})
export class AlertComponent implements OnInit {
    @Input() color = 'blue'

    get bgColor() {
        return `bg-${this.color}-400`
    }
    constructor() {
    }

    ngOnInit(): void {
    }

}
