import { Cart } from "./components/cart";
import { CART_ITEMS, CURRENCIES, INITIAL_CURRENCY } from "./constants";

class App {
  static init() {
    const cart = new Cart(CART_ITEMS, CURRENCIES, INITIAL_CURRENCY);
  }
}

App.init();
