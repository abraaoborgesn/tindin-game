import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/interfaces/Game';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  @Input('gamesList') gamesList!: Game[]

  constructor() { }

  ngOnInit(): void {
  }

}
