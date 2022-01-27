import { CartItemInfo, CartResultPrices, CurrencyMap } from '../types';
import { Util } from '../util';
import { CartItem } from './cart-item';
import { Currency } from './currency';

export class Cart {
  items: CartItem[];
  currency: Currency;
  totalPrices: CartResultPrices;
  totalPriceElement: HTMLElement;

  constructor(
    items: CartItemInfo[],
    currencies: CurrencyMap,
    initialCurrency: string
  ) {
    this.currency = new Currency(currencies, initialCurrency);
    this.currency.setRatesCallback(this.setPrices.bind(this));
    this.currency.setChangeCallback(this.changeCurrency.bind(this));

    this.totalPriceElement = document.getElementById('total-price');

    this.setItems(items);
  }

  setItems(items: CartItemInfo[]): void {
    const listElement = document.getElementById('items');
    const fragment = new DocumentFragment();

    this.items = [];

    items.forEach((item) => {
      const newItem = new CartItem(item, this.currency.getCurrentSymbol());

      this.items.push(newItem);
      fragment.append(newItem.element);
    });

    listElement.append(fragment);
  }

  setPrices(): void {
    this.totalPrices = {};

    this.items.forEach((item) => {
      item.calculatePrices(this.currency.rates);
    });

    this.calculateTotalPrices();
    this.setTotalPrice();

    Util.hideLoader();
  }

  calculateTotalPrices(): void {
    for (const currency in this.currency.rates) {
      this.totalPrices[currency] = this.items.reduce((previousValue, item) => {
        return previousValue + item.prices[currency];
      }, 0);
    }
  }

  setTotalPrice(): void {
    this.totalPriceElement.textContent = `${this.currency.getCurrentSymbol()} ${Util.getCorrectPrice(
      this.totalPrices[this.currency.currentValue]
    )}`;
  }

  changeCurrency(): void {
    this.items.forEach((item) => {
      item.changeCurrency(
        this.currency.currentValue,
        this.currency.getCurrentSymbol()
      );
    });
    this.setTotalPrice();
  }
}
