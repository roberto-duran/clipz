import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/models/clip.model';

import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  videoOrder = 'asc'
  clips: IClip[] = []
  activeClip: IClip | null = null
  sort$: BehaviorSubject<string>
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder)
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params.params.sort ? params.params.sort : 'asc'
      this.sort$.next(this.videoOrder)
    })

    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = []
      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    })
  }

  sort($event: Event) {
    const { value } = ($event.target as HTMLSelectElement)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    })
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault()
    this.activeClip = clip

    this.modal.toggleModal('editClip')
  }

  update($event: IClip) {
    this.clips.forEach((elemet, index) => {
      if (elemet.docID == $event.docID) {
        this.clips[index].title = $event.title
      }
    })
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault()

    this.clipService.deleteClip(clip)

    this.clips.forEach((element, index) => {
      if (element.docID === clip.docID) {
        this.clips.splice(index, 1)
      }
    })
  }

}