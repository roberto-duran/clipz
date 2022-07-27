import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/compat/storage'
import {AngularFireAuth} from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import {v4 as uuid} from 'uuid';
import { switchMap, combineLatestWith, forkJoin } from 'rxjs';
import {FfmpegService} from "../../services/ffmpeg.service";

import {ClipService} from 'src/app/services/clip.service';
import {Router} from '@angular/router';

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
    showPercentage = false

    //alert info
    showAlert = false
    alertColor = 'blue'
    alertMsg = 'Please wait! your clip is bing uploaded'
    inSubmission = false
    user: firebase.User | null = null

    task?: AngularFireUploadTask
    screenshots: string[] = []
    selectedScreenshot = ''
    screenshotTask?: AngularFireUploadTask

    constructor(
        private storage: AngularFireStorage,
        private auth: AngularFireAuth,
        private clipService: ClipService,
        private router: Router,
        public ffmpegService: FfmpegService
    ) {
        auth.user.subscribe(user => this.user = user)
        this.ffmpegService.init()
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

    async storeFile($event: Event) {
        if(this.ffmpegService.isRunning){
            return;
        }
        this.isdragOver = false

        this.file = ($event as DragEvent).dataTransfer ?
            ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
            ($event.target as HTMLInputElement).files?.item(0) ?? null

        if (!this.file || this.file.type !== 'video/mp4') {
            return
        }

        this.screenshots = await this.ffmpegService.getScreenshots(this.file)
        this.selectedScreenshot = this.screenshots[0]
        this.title.setValue(
            this.file.name.replace(/\.[^/.]+$/, '')
        )
        this.nextStep = true
    }

    async uploadFile() {
        this.uploadForm.disable()
        const clipFileName = uuid()
        const clipPath = `clips/${clipFileName}.mp4`

        const screenshotBlob = await this.ffmpegService.blobFromURL(
            this.selectedScreenshot
        )
        const screenshotPath = `screenshots/${clipFileName}.png`

        this.showAlert = true
        this.alertColor = 'blue'
        this.alertMsg = 'Please wait! your clip is bing uploaded'
        this.inSubmission = true;
        this.showPercentage = true
        this.task = this.storage.upload(clipPath, this.file);
        const clipRef = this.storage.ref(clipPath)

        this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob)
        const screenshotRef = this.storage.ref(screenshotPath)

        this.task.percentageChanges().pipe(
            combineLatestWith(this.screenshotTask.percentageChanges())
        ).subscribe((progress) => {
            const [clipProgress, screenshotProgress] = progress

            if(!clipProgress || !screenshotProgress){
                return
            }

            const total = clipProgress + screenshotProgress
            this.percentage = total as number / 200
        })

        forkJoin([
            this.task.snapshotChanges(),
            this.screenshotTask.snapshotChanges()
        ]).pipe(
            switchMap(() => forkJoin([
                clipRef.getDownloadURL(),
                screenshotRef.getDownloadURL()
            ]))
        ).subscribe({
            next: async (urls) => {
                const [clipURL, screenshotURL] = urls

                const clip = {
                    uid: this.user?.uid as string,
                    displayName: this.user?.displayName as string,
                    title: this.title.value as string,
                    fileName: `${clipFileName}.mp4`,
                    url: clipURL,
                    screenshotURL,
                    screenshotFileName: `${clipFileName}.png`,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }
                const newClip = await this.clipService.createClip(clip)
                this.alertColor = 'green'
                this.alertMsg = 'Success! Your clip is now ready to share'
                this.showPercentage = false
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
                this.showPercentage = false
                console.error(error)
            }
        })
    }

}
