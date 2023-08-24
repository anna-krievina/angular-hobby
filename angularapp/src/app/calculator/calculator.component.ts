import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  public http: HttpClient;
  public add: string = "+";
  public subtract: string = "-";
  public multipy: string = "*";
  public divide: string = "÷";
  public undo: string = "⌫";
  public reset: string = "C";
  public equals: string = "=";
  public negate: string = "+/-";
  public result: string = "0";

  constructor(http: HttpClient) {
    this.http = http;
  }

  calculateResult(item: string) {
    this.httpPost('/Calculator/api/Calculate', item);
  }

  negateResult(item: string) {
    this.httpPost('/Calculator/api/NegateResult', item);
  }

  httpPost(url: string, item: string) {    
    let resultModel = new ResultModel(item);
    this.http.post<string>(url, resultModel).subscribe(result => {
      this.result = result.toString();
    }, error => console.error(error));
  }

  calculate(buttonValue: string) {
    // 22 is the length of maximum integer value
    if (this.result.length < 22) {
      switch (buttonValue) {
        case this.add:
        case this.subtract:
        case this.multipy:
        case this.divide:
          let calculations = ["+", "-", "*", "÷"];
          let index = -1;
          for (let i = 0; i < calculations.length; i++) {
            index = this.result.indexOf(calculations[i]);
            if (index > -1) {
              this.result = this.result.replace(calculations[i], buttonValue);
              break;
            }
          }
          if (index == -1) {
            this.result = this.result + " " + buttonValue + " ";
          }
          break;
        case this.undo:
          // remove last character
          this.result = this.result.substring(0, this.result.length - 1);
          break;
        case this.reset:
          this.result = "0";
          break;
        // all the numbers
        default:
          this.result = this.result + buttonValue
          // removing the zero otherwise 01 and the like would be displayed
          if (this.result.length == 2 && this.result.startsWith("0")) {
            this.result = this.result.substring(1, this.result.length);
          }
          break;
      }
    }
  }

}
class ResultModel {
  Result?: string;

  constructor(Result?: string) {
    this.Result = Result;
  }
}
