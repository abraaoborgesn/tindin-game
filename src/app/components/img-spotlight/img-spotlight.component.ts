import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  EventEmitter,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, filter, fromEvent } from 'rxjs';
import SwiperCore, { Navigation, Pagination } from 'swiper';

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-img-spotlight',
  templateUrl: './img-spotlight.component.html',
  styleUrls: ['./img-spotlight.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImgSpotlightComponent implements OnInit {
  @ViewChild('imgSpotlight') imgSpotlight!: ElementRef;
  @ViewChild('urlInput') urlInput!: ElementRef;
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('marginChange') marginChange!: ElementRef;
  @Input('sliderUrls') sliderUrls!: string[];
  @Input('newGame') newGame!: boolean;
  @Output() newMedia = new EventEmitter();
  @Output() deleteMedia = new EventEmitter();

  inSpotlight = false;

  //Swiper controls
  spaceBetween = 30;
  slidesPerGroup = 1;
  slidesPerView = 1;

  constructor(private toast: ToastrService) {}

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(filter(Boolean), distinctUntilChanged())
      .subscribe(() => {
        if (innerWidth < 980 && innerWidth > 619) {
          this.slidesPerGroup = 2;
          this.slidesPerView = 2;
        }

        if (innerWidth < 620 || innerWidth > 980) {
          this.slidesPerGroup = 1;
          this.slidesPerView = 1;
        }
      });
  }

  isImg(urlOrId: string): boolean {
    const imgExtensions = ['jpg', 'png', 'jpeg'];
    for (let i in imgExtensions) {
      if (urlOrId.includes(imgExtensions[i])) {
        return true;
      }
    }
    return false;
  }

  changeImgOnSpotlight(url: string | undefined) {
    if (url) {
      const isImg = this.isImg(url);
      if (isImg) {
        this.imgSpotlight.nativeElement.src = url;
        this.inSpotlight = true;
        return;
      }
      return;
    }
  }

  validateMedia(url: string) {
    const validExtensions = ['jpg', 'jpeg', 'png', 'youtube.com/watch?'];
    if (url.includes(validExtensions[validExtensions.length - 1])) {
      return true;
    }

    function reverseString(url: string) {
      return url.split('').reverse().join('');
    }

    const reverseUrlExtension = reverseString(url).split('.')[0];
    const urlExtension = reverseString(reverseUrlExtension);
    for (let i in validExtensions) {
      if (urlExtension.includes(validExtensions[i])) {
        return true;
      }
    }
    return false;
  }

  deleteMediaEventEmit(url: string) {
    const mediaType = this.isImg(url);
    this.deleteMedia.emit({
      img: mediaType ? true : false,
      video: !mediaType ? true : false,
      url,
    });
  }

  newMediaEventEmit(name: string, url: string) {
    const isValid = this.validateMedia(url);
    if (name !== '') {
      if (isValid) {
        if (this.isImg(url)) {
          this.newMedia.emit({
            name,
            url,
          });

          this.urlInput.nativeElement.value = '';
          this.nameInput.nativeElement.value = '';
          return;
        }

        if (
          name.toUpperCase() === 'GAMEPLAY' ||
          name.toUpperCase() === 'TRAILER' ||
          name.toUpperCase() === 'CUSTOM'
        ) {
          this.newMedia.emit({
            type: name.toUpperCase(),
            url: url,
          });
          this.urlInput.nativeElement.value = '';
          this.nameInput.nativeElement.value = '';
          return;
        }

        this.toast.error('For video use name GAMEPLAY, TRAILER or CUSTOM');
      } else {
        this.toast.error('Invalid format or provider', 'Error');
      }
    } else {
      this.toast.error('Name is required for media', 'Error');
    }
  }
}
