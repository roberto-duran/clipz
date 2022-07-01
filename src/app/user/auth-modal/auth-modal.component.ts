import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  private authModalName: string = 'auth'
  constructor(public modal: ModalService) { }

  ngOnInit(): void {
      this.modal.register(this.authModalName);
  }

  ngOnDestroy() {
      this.modal.unregister(this.authModalName);
  }

}
