import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from "../../services/modal.service";

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() modalID = ''
    constructor(
        public modal: ModalService,
        public el: ElementRef
    ) {
    }

    ngOnInit(): void {
        document.body.appendChild(this.el.nativeElement);
    }

    ngOnDestroy(): void {
        document.body.removeChild(this.el.nativeElement);
    }

    closeModal() {
        this.modal.toggleModal(this.modalID);
    }
}
