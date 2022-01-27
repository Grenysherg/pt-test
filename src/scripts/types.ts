export type CurrencyInfo = {
  iso: string;
  symbol: string;
};

export type CurrencyIso = CurrencyInfo['iso'];

export type CurrencySymbol = CurrencyInfo['symbol'];

export type CurrencyMap = Map<string, CurrencyInfo>;

export type CurrencyRates = { [key: string]: number };

export type CurrencyRate = [string, number];

export type CurrencyRatesCallback = () => void;

export type CurrencyChangeCallback = () => void;

export type CartItemInfo = {
  name?: string;
  price: number;
};

export type CartResultPrices = {
  [key: string]: number;
};
