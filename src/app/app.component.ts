import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';

import 'rxjs/add/operator/filter';

import { DialogComponent } from './dialog/dialog.component';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  investmentBTC: number;
  investmentBRL: number;
  btcBRL: number;
  btc: number;
  profitBTC: number;
  profitBRL: number;
  walletBTC: number;
  walletBRL: number;

  mercadoBitcoinBaseApi = 'https://www.mercadobitcoin.net/api/';
  binanceBaseApi = 'https://api.binance.com/api/v1/ticker/24hr?symbol=';
  
  coinsParams = [
    {symbol: 'BTCUSDT', order: 1},
    {symbol: 'TRXBTC', order: 2},
    {symbol: 'XRPBTC', order: 3},
    {symbol: 'ETHBTC', order: 4},
    {symbol: 'LTCBTC', order: 5},
    {symbol: 'BCCBTC', order: 6},
    {symbol: 'DASHBTC', order: 7},
    {symbol: 'XMRBTC', order: 8}
  ];

  displayedColumns = ['symbol', 'askPrice', 'priceChangePercent'];
  coinsList: Coin[] = [];
  dataSource: MatTableDataSource<Coin>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog, private http: Http) {
    this.investmentBTC = 0.00949349;
    this.investmentBRL = 451;
    this.walletBTC = 0.00993867;
    this.coinsList = [];
    this.dataSource = new MatTableDataSource<Coin>(this.coinsList);
  }

  ngOnInit() {
    let coinsList: Coin[] = [];

    setInterval(() => {
      this.coinsList = [];

      console.log(this.coinsParams);

      this.http.get(this.mercadoBitcoinBaseApi + 'BTC' + '/ticker/').subscribe(response => {
        let data = response.json();
        
        data.order = 0;
        data.symbol = 'BTCBRL';
        data.askPrice = data.ticker.last;
        data.priceChangePercent = 0;

        this.btcBRL = data.askPrice;
        this.calculateWallet(this.btcBRL);
        this.calculateProfit();
        
        this.coinsList.push(data);
        this.dataSource.data = this.coinsList.sort();    
      })

      for (const coin of this.coinsParams) {
        this.http.get(this.binanceBaseApi + coin.symbol).subscribe(response => {
          let data = response.json();
          data.order = coin.order;
          this.coinsList.push(data);
          this.dataSource.data = this.coinsList.sort();    
        })
      }

      // console.log(this.coinsList);

    }, 10000);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  calculateWallet(value: number) {
    this.walletBRL = value*this.walletBTC;
  }

  calculateProfit() {
    this.profitBTC = this.walletBTC-this.investmentBTC;
    this.profitBRL = this.walletBRL-this.investmentBRL;
  }

  openAdminDialog() {
    this.dialog.open(DialogComponent).afterClosed()
      .filter(result => !!result)
      .subscribe(user => {
        // this.users.push(user);
      });
  }

}

export interface Coin {
  order: number;
  symbol: string;
  askPrice: string;
  priceChangePercent: string;
}