import {
  CurrencyMap,
  CurrencyRates,
  CurrencyRatesCallback,
  CurrencyChangeCallback,
  CurrencyInfo,
  CurrencySymbol,
  CurrencyRate,
} from '../types';
import { Util } from '../util';

export class Currency {
  currencies: CurrencyMap;
  currentValue: string;
  rates: CurrencyRates;
  ratesCallback: CurrencyRatesCallback;
  changeCallback: CurrencyChangeCallback;

  constructor(currencies: CurrencyMap, initialValue: string) {
    this.currencies = currencies;
    this.currentValue = initialValue;
    this.configireSelectElement();
    this.getRates();
  }

  setRatesCallback(ratesCallback: CurrencyRatesCallback): void {
    this.ratesCallback = ratesCallback;
  }

  setChangeCallback(changeCallback: CurrencyChangeCallback): void {
    this.changeCallback = changeCallback;
  }

  configireSelectElement(): void {
    const selectElement = document.getElementById(
      'select'
    ) as HTMLSelectElement;
    const fragment = new DocumentFragment();

    for (const currency of this.currencies.keys()) {
      const optionElement = new Option(
        currency,
        currency,
        null,
        currency === this.currentValue
      );
      fragment.append(optionElement);
    }

    selectElement.append(fragment);
    selectElement.addEventListener('change', () => {
      this.onChange(selectElement.value);
    });
  }

  onChange(currency: string): void {
    this.currentValue = currency;
    this.changeCallback();
  }

  getRates(): void {
    const promises: Promise<CurrencyRate>[] = [];

    for (const currency of this.currencies.keys()) {
      promises.push(this.fetchRate(currency));
    }

    Promise.all(promises)
      .then((values) => {
        this.rates = {};
        values.forEach((value) => {
          this.rates[value[0]] = value[1];
        });
        this.ratesCallback();
      })
      .catch(() => {
        Util.showError();
      });
  }

  fetchRate(currency: string): Promise<CurrencyRate> {
    if (currency === this.currentValue) {
      return Promise.resolve([this.currentValue, 1]);
    }

    const prop = `${this.getIso(this.currentValue)}_${this.getIso(currency)}`;

    return fetch(
      `https://free.currconv.com/api/v7/convert?q=${prop}&compact=ultra&apiKey=64c7419f27e34b7a148a`
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }

        throw new Error();
      })
      .then((data) => {
        return [currency, +data[prop]];
      });
  }

  getIso(currency: string): CurrencyInfo['iso'] {
    return this.currencies.get(currency).iso;
  }

  getCurrentSymbol(): CurrencySymbol {
    return this.currencies.get(this.currentValue).symbol;
  }
}
