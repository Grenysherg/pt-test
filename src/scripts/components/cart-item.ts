import {
  CartItemInfo,
  CartResultPrices,
  CurrencyRates,
  CurrencySymbol,
} from '../types';
import { Util } from '../util';

export class CartItem {
  currencySymbol: CurrencySymbol;
  prices: CartResultPrices;
  initialPrice: number;
  element: Element;

  constructor(info: CartItemInfo, currencySymbol: CurrencySymbol) {
    this.initialPrice = info.price;
    this.currencySymbol = currencySymbol;
    this.createElement(info);
  }

  createElement(info: CartItemInfo): void {
    const template = document.getElementById(
      'item-template'
    ) as HTMLTemplateElement;
    this.element = document.importNode(
      template.content.firstElementChild,
      true
    );
    this.element.querySelector('.item__name').textContent = info.name;
    this.setPrice(this.initialPrice);
  }

  calculatePrices(rates: CurrencyRates): void {
    this.prices = {};

    for (const currency in rates) {
      this.prices[currency] = this.initialPrice * rates[currency];
    }
  }

  setPrice(price: number): void {
    this.element.querySelector('.item__price').textContent = `${
      this.currencySymbol
    } ${Util.getCorrectPrice(price)}`;
  }

  changeCurrency(currency: string, currencySymbol: CurrencySymbol): void {
    this.currencySymbol = currencySymbol;
    this.setPrice(this.prices[currency]);
  }
}
