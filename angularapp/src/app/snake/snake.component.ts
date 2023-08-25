import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'snake',
  templateUrl: '../canvas.html'
})
export class SnakeComponent implements AfterViewInit {
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  public bgColor: string = "black";
  public canvasSizeX: number = 450;
  public canvasSizeY: number = 450;
  public canvasId: string = "snakeCanvas" 
  private snakeArray: CanvasPart[] = [];
  private pixelSize: number = 13;
  private snakeColor: string = "#34aeeb";
  private snakeArrayLength: number = 4;
  private dot?: CanvasPart;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    //setInterval(() => alert(0), 1000);
    setInterval(() => this.redrawCanvas(<HTMLCanvasElement>this.canvas, <CanvasRenderingContext2D>this.ctx), 30);
    this.initSnake(100, 200, this.ctx);
    this.generateDot(this.ctx);
  }

  redrawCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.dot?.update(ctx);
    this.moveSnake(ctx);
  }

  generateDot(ctx: CanvasRenderingContext2D) {
    var x = (Math.random() * this.canvasSizeX) + 1;
    var y = (Math.random() * this.canvasSizeY) + 1;
    // check for this.snakeArray collision
    while (true) {
      var result = this.snakeArray.find(e => (x >= e.x && x <= e.x + this.pixelSize) || (y >= e.y && y <= e.y + this.pixelSize));
      if (result) {
        x = (Math.random() * this.canvasSizeX) + 1;
        y = (Math.random() * this.canvasSizeY) + 1;
      } else {
        break;
      }
    };
    // making it so it fits on a grid
    var remainderX = x % this.pixelSize;
    var remainderY = y % this.pixelSize;
    if (remainderX > 0) {
      x += remainderX;
    }
    if (remainderY > 0) {
      y += remainderY;
    }
    // subtracting height and width so it doesn't go out of bounds
    if (x > this.canvasSizeX - this.pixelSize) {
      x = this.canvasSizeX - this.pixelSize;
    }
    if (y > this.canvasSizeY - this.pixelSize) {
      y = this.canvasSizeY - this.pixelSize;
    }
    if (!this.dot) {
      this.dot = new CanvasPart(this.pixelSize, this.pixelSize, "white", x, y, ctx);
    } else {
      this.dot.newPos(x, y);
      this.dot.update(ctx);
    }
  }

  initSnake(snakex: number, snakey: number, ctx: CanvasRenderingContext2D) {
    for (var i = 0; i < this.snakeArrayLength; i++) {
      this.snakeArray.push(new CanvasPart(this.pixelSize, this.pixelSize, this.snakeColor, snakex, snakey, ctx));
      // y will be the same at first
      snakex -= this.pixelSize;
    }
  }

  updateSnake(snakex: number, snakey: number, ctx: CanvasRenderingContext2D) {
    for (var i = 0; i < this.snakeArrayLength; i++) {
      // subtracting the pixel size because in moveSnake() it's only increased by 1
      let oldSnakex = this.snakeArray[i].x;
      let oldSnakey = this.snakeArray[i].y;
      // it moves either on the x or y axis
      if (snakex != oldSnakex) {
        oldSnakex -= this.pixelSize + 1;
      } else if (snakey != oldSnakey) {
        oldSnakey += this.pixelSize;
      }
      this.snakeArray[i].newPos(snakex, snakey);
      this.snakeArray[i].update(ctx);
      snakex = oldSnakex;
      snakey = oldSnakey;
    }
  }

  moveSnake(ctx: CanvasRenderingContext2D) {
    var dotx: number = this.dot?.x || 0;
    var doty: number = this.dot?.y || 0;
    var snakex = this.snakeArray[0].x;
    var snakey = this.snakeArray[0].y;
    // check for collision 
    if ((dotx >= snakex - this.pixelSize && dotx <= snakex + this.pixelSize) && (doty >= snakey - this.pixelSize && doty <= snakey + this.pixelSize)) {
      // add to snake
      var newSnakex = this.snakeArray[this.snakeArrayLength - 1].x - this.pixelSize;
      var newSnakey = this.snakeArray[this.snakeArrayLength - 1].y;
      this.snakeArray.push(new CanvasPart(this.pixelSize, this.pixelSize, this.snakeColor, newSnakex, newSnakey, ctx));
      this.snakeArrayLength++;

      this.generateDot(ctx);
    } else {
      this.dot?.update(ctx);
    }
    // add speed
    if (dotx > snakex && dotx + this.pixelSize > snakex) {
      snakex += 1;
    } else if (doty > snakey && doty + this.pixelSize > snakey) {
      snakey += 1;
    } else if (dotx < snakex && dotx + this.pixelSize < snakex) {
      snakex -= 1;
    } else if (doty < snakey && doty + this.pixelSize < snakey) {
      snakey -= 1;
    }
    this.updateSnake(snakex, snakey, ctx);
  }
}



class CanvasPart {

  private width: number;
  private height: number;
  private color: string;
  public x: number;
  public y: number;
  private ctx?: CanvasRenderingContext2D;

  constructor(width: number, height: number, color: string, x: number, y: number, ctx: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  newPos(newx: number, newy: number) {
    this.x = newx;
    this.y = newy;
  }
}
