import { Component, OnInit, OnDestroy, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  modalIDName = 'editClip'
  @Input() activeClip: IClip | null = null
  @Output() update = new EventEmitter
  //alert
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! updating clip'
  inSubmition = false


  //form 
  clipID = new FormControl('', {
    nonNullable: true
  })
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  })

  editForm = new FormGroup({
    title: this.title
  })

  constructor(
    private modal: ModalService,
    private clipService: ClipService
  ) { }

  ngOnInit(): void {
    this.modal.register(this.modalIDName)
  }

  ngOnDestroy(): void {
    this.modal.unregister(this.modalIDName)
  }

  ngOnChanges(): void {
    if (!this.activeClip) {
      return
    }
    this.showAlert = false
    this.inSubmition = false
    this.clipID.setValue(this.activeClip.docID as string)
    this.title.setValue(this.activeClip.title)
  }

  async submit() {
    if (!this.activeClip) {
      return
    }

    this.editForm.disable()
    this.showAlert = true
    this.inSubmition = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! updating clip'
    try {
      this.clipService.updateClip(this.clipID.value, this.title.value as string)
    } catch (e) {
      this.inSubmition = false
      this.alertColor = 'red'
      this.alertMsg = 'Something went worng'
      this.editForm.enable()
      return
    }

    this.activeClip.title = this.title.value as string
    this.update.emit(this.activeClip)

    this.inSubmition = false
    this.alertColor = 'green'
    this.alertMsg = 'Success!'

  }


}
