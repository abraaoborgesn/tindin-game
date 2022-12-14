import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { first, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Game } from '../interfaces/Game';

interface ListGames {
  games: Game[];
  totalSize: number;
}

interface ListGamesQueryOptions {
  paginationDetails?: {
    perPage: number;
    page: number;
  };
  highlight?: boolean;
}

interface RateGameApiResponse {
  ratingUpdated: number;
  totalVotes: number;
  success: true;
}

interface UpdateGameFields {
  _id: string;
  description?: string;
  releaseYear?: number;
  mediumPrice?: number;
  launchDate?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly baseURL = environment.baseURL;

  constructor(private http: HttpClient, private cookie: CookieService) {}

  listGames({
    paginationDetails = { perPage: 8, page: 1 },
    highlight,
  }: ListGamesQueryOptions): Observable<ListGames> {
    let params = new HttpParams({
      fromObject: {
        ...paginationDetails,
        highlight: highlight ?? '',
      },
    });

    return this.http
      .get<ListGames>(`${this.baseURL}/games`, { params })
      .pipe(first());
  }

  searchGame(query: string): Observable<Game[] | []> {
    return this.http.get<ListGames>(`${this.baseURL}/games`).pipe(
      first(),
      map((response) => {
        const searchResult = response.games.filter((game) =>
          game.title.toLowerCase().includes(query.toLowerCase())
        );
        return searchResult;
      })
    );
  }

  getGame(gameId: string): Observable<Game> {
    return this.http
      .get<{ game: Game }>(`${this.baseURL}/games/${gameId}`)
      .pipe(
        first(),
        map((response) => response.game)
      );
  }

  deleteGame(gameId: string): Observable<Game> {
    let token = this.cookie.get('auth.token');
    let headers = new HttpHeaders().set('x-api-key', token);
    return this.http.delete<Game>(`${this.baseURL}/games/${gameId}`, {
      headers,
    });
  }

  rateGame(gameId: string, rate: number): Observable<RateGameApiResponse> {
    return this.http
      .post<RateGameApiResponse>(`${this.baseURL}/games/rate`, { gameId, rate })
      .pipe(first());
  }

  insertGame(game: Omit<Game, '_id'>): Observable<Game> {
    let token = this.cookie.get('auth.token');
    let headers = new HttpHeaders().set('x-api-key', token);
    return this.http
      .post<Game>(`${this.baseURL}/games`, { ...game }, { headers })
      .pipe(first());
  }

  updateGame(updateFields: UpdateGameFields): Observable<Game> {
    let token = this.cookie.get('auth.token');
    let headers = new HttpHeaders().set('x-api-key', token);
    return this.http.put<Game>(
      `${this.baseURL}/games`,
      { ...updateFields },
      { headers }
    );
  }
}
