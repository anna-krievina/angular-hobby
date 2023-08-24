import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent {
  public board: TicTacModel[] = [];
  public gameOver: boolean = false;
  public http: HttpClient;

  constructor(http: HttpClient) {
    const BoardSize: number = 9;
    let idCounter: number = 1;

    for (let i = 0; i < BoardSize; i++) {
      this.board[i] = new TicTacModel(idCounter);
      idCounter++;
    }
    this.http = http;
  }

  move(index: number) {
    if (this.board && !this.gameOver) {
      if (!this.board[index].Value) {
        this.board[index].Value = "X";
        this.calculateMoveAndResult();
      }
    }
  }

  calculateMoveAndResult() {
    this.http.post<number>('/TicTacToe/api/GetMove', this.board).subscribe(result => {
      this.board[result].Value = "O";
      // after both moves are made, need to calculate if winning conditions are met.
      this.http.post<boolean>('/TicTacToe/api/CalculateGameOver', this.board).subscribe(result => {
      this.gameOver = result;
      }, error => console.error(error));
    }, error => console.error(error));
  }

}

class TicTacModel {
  Id: number;
  Value?: string;

  constructor(Id: number, Value?: string) {
    this.Id = Id;
    this.Value = Value;
  }
}
