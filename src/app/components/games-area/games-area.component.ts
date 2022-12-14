import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from 'src/app/interfaces/Game';

@Component({
  selector: 'app-games-area',
  templateUrl: './games-area.component.html',
  styleUrls: ['./games-area.component.scss']
})
export class GamesAreaComponent implements OnInit {

  @Input() gamesList!: Game[]
  @Input() searchList!: Game[] | [] | null
  @Input() hasMoreGames!: boolean
  @Output() viewMoreGames = new EventEmitter()
  paginationDetails = {
    perPage: 4,
    page: 2
  }

  constructor() { }

  ngOnInit(): void {
  }

  handleMoreGames() {
    if(!this.hasMoreGames) {
      this.paginationDetails.page++
      // console.log(this.paginationDetails.page)
      this.viewMoreGames.emit(this.paginationDetails)
    }
  }
}
