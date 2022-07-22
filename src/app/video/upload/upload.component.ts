import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';

import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {
  isdragOver = false
  file: File | null = null
  nextStep = false
  percentage = 0
  showPrecentage = false

  //alert info
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! your clip is bing uploaded'
  inSubmition = false
  user: firebase.User | null = null

  task?: AngularFireUploadTask

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router
  ) {
    auth.user.subscribe(user => this.user = user)
  }

  ngOnDestroy(): void {
    this.task?.cancel()
  }

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  })

  uploadForm = new FormGroup({
    title: this.title
  })

  storeFile($event: Event) {
    this.isdragOver = false
    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null


    if (!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    this.nextStep = true
  }

  uploadFile() {
    this.uploadForm.disable()
    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! your clip is bing uploaded'
    this.inSubmition = true;
    this.showPrecentage = true
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath)

    this.task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })

    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value as string,
          fileName: `${clipFileName}.mp4`,
          url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        const newClip = await this.clipService.createClip(clip)
        this.alertColor = 'green'
        this.alertMsg = 'Succes! Your clip is now ready to share'
        this.showPrecentage = false
        setTimeout(() => {
          this.router.navigate([
            'clip', newClip.id
          ])
        }, 1000);
      },
      error: (error) => {
        this.uploadForm.enable()
        this.alertColor = 'red'
        this.alertMsg = 'Error! Uploading your video'
        this.showPrecentage = false
        console.error(error)
      }
    })
  }

}
