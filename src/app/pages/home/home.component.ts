import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from 'rxjs';
import { returnGameRoutesError } from 'src/app/helpers/returnGameRoutesError';
import { Game } from 'src/app/interfaces/Game';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('searchInput') set inputRef(elRef: ElementRef<HTMLInputElement>) {
    if (elRef) {
      this.searchInputRef = elRef;
      this.handleSearch();
    }
  }

  gamesList!: Game[];
  searchList!: Game[] | [] | null;
  hasMoreGames = false;
  isLogged!: boolean;
  actualSlide = 0;
  imagesBanner: {
    name: string;
    url: string;
    _id: string;
  }[] = [{ name: '', url: 'assets/banner0.jpg', _id: '' }];
  showGoUpBtn = false;
  onSearch = false;

  constructor(
    private gameService: GameService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private toast: ToastrService
  ) {
    this.isLogged = this.authService.isLogged;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.gameService.listGames({}).subscribe({
      next: (response) => {
        // console.log(response.games)
        this.spinner.hide();
        this.gamesList = response.games;
      },
      error: (err) => {
        const {message, name} = returnGameRoutesError(err)
        this.toast.error(message, name)
        this.spinner.hide()
      },
    });

    this.gameService
      .listGames({
        paginationDetails: { page: 0, perPage: 0 },
        highlight: true,
      })
      .subscribe({
        next: (response) => {
          this.imagesBanner.pop();
          for (let i in response.games) {
            const actualGame = response.games[i];
            if (actualGame.photos[0].url) {
              if (Number(i) < 5) {
                this.imagesBanner.push({
                  name: actualGame.title,
                  url: actualGame.photos[0].url,
                  _id: actualGame._id,
                });
              } else {
                break;
              }
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });

    this.setScrollEvent();
  }

  ngDoCheck(): void {
    if (this.isLogged !== this.authService.isLogged) {
      this.isLogged = this.authService.isLogged
    }
  }

  setScrollEvent() {
    fromEvent(window, 'scroll')
      .pipe(filter(Boolean), distinctUntilChanged())
      .subscribe(() => {
        if (window.scrollY > 300) this.showGoUpBtn = true;
        if (window.scrollY < 300) this.showGoUpBtn = false;
      });
  }

  onViewMoreGames(event: { perPage: number; page: number }) {
    this.spinner.show()
    this.gameService
      .listGames({
        paginationDetails: event,
      })
      .subscribe((response) => {
        response.games.map((game) => {
          return this.gamesList.push(game);
        });
        if (this.gamesList.length === response.totalSize) {
          if (!this.hasMoreGames) {
            this.hasMoreGames = true
          }
        }
        this.spinner.hide()
      });
  }

  handleSearch() {
    fromEvent(this.searchInputRef.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.onSearch = true;
          const query = this.searchInputRef.nativeElement.value;
          if (query) {
            this.gameService.searchGame(query).subscribe((response) => {
              this.searchList = response;
              this.onSearch = false;
            });
          } else {
            this.searchList = null;
            this.onSearch = false;
          }
        })
      )
      .subscribe();
  }

  onTeste() {
    console.log(this.gamesList);
  }
}
