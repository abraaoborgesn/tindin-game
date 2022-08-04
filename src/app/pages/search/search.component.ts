import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Game } from 'src/app/interfaces/Game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  gamesList$!: Observable<Game[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        const { q } = params;
        this.gamesList$ = this.gameService.searchGame(q);
      },
    });
  }
}
