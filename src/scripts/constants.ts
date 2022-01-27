import { CartItemInfo, CurrencyInfo } from './types';

export const CART_ITEMS: CartItemInfo[] = [
  { name: 'Item1', price: 20 },
  { name: 'Item2', price: 45 },
  { name: 'Item3', price: 67 },
  { name: 'Item4', price: 1305 },
];

export const INITIAL_CURRENCY = 'dollars';

export const CURRENCIES: Map<string, CurrencyInfo> = new Map([
  [
    'rubles',
    {
      iso: 'RUB',
      symbol: '₽',
    },
  ],
  [
    'euros',
    {
      iso: 'EUR',
      symbol: '€',
    },
  ],
  [
    'dollars',
    {
      iso: 'USD',
      symbol: '$',
    },
  ],
  [
    'pounds',
    {
      iso: 'GBP',
      symbol: '£',
    },
  ],
  [
    'yens',
    {
      iso: 'JPY',
      symbol: '¥',
    },
  ],
]);
