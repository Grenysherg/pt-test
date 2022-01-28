/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 49:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CartItem = void 0;
var util_1 = __webpack_require__(483);
var CartItem = /** @class */ (function () {
    function CartItem(info, currencySymbol) {
        this.initialPrice = info.price;
        this.currencySymbol = currencySymbol;
        this.createElement(info);
    }
    CartItem.prototype.createElement = function (info) {
        var template = document.getElementById('item-template');
        this.element = document.importNode(template.content.firstElementChild, true);
        this.element.querySelector('.item__name').textContent = info.name;
        this.setPrice(this.initialPrice);
    };
    CartItem.prototype.calculatePrices = function (rates) {
        this.prices = {};
        for (var currency in rates) {
            this.prices[currency] = this.initialPrice * rates[currency];
        }
    };
    CartItem.prototype.setPrice = function (price) {
        this.element.querySelector('.item__price').textContent = "".concat(this.currencySymbol, " ").concat(util_1.Util.getCorrectPrice(price));
    };
    CartItem.prototype.changeCurrency = function (currency, currencySymbol) {
        this.currencySymbol = currencySymbol;
        this.setPrice(this.prices[currency]);
    };
    return CartItem;
}());
exports.CartItem = CartItem;


/***/ }),

/***/ 92:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Cart = void 0;
var util_1 = __webpack_require__(483);
var cart_item_1 = __webpack_require__(49);
var currency_1 = __webpack_require__(859);
var Cart = /** @class */ (function () {
    function Cart(items, currencies, initialCurrency) {
        this.currency = new currency_1.Currency(currencies, initialCurrency);
        this.currency.setRatesCallback(this.setPrices.bind(this));
        this.currency.setChangeCallback(this.changeCurrency.bind(this));
        this.totalPriceElement = document.getElementById('total-price');
        this.setItems(items);
    }
    Cart.prototype.setItems = function (items) {
        var _this = this;
        var listElement = document.getElementById('items');
        var fragment = new DocumentFragment();
        this.items = [];
        items.forEach(function (item) {
            var newItem = new cart_item_1.CartItem(item, _this.currency.getCurrentSymbol());
            _this.items.push(newItem);
            fragment.append(newItem.element);
        });
        listElement.append(fragment);
    };
    Cart.prototype.setPrices = function () {
        var _this = this;
        this.totalPrices = {};
        this.items.forEach(function (item) {
            item.calculatePrices(_this.currency.rates);
        });
        this.calculateTotalPrices();
        this.setTotalPrice();
        util_1.Util.hideLoader();
    };
    Cart.prototype.calculateTotalPrices = function () {
        var _loop_1 = function (currency) {
            this_1.totalPrices[currency] = this_1.items.reduce(function (previousValue, item) {
                return previousValue + item.prices[currency];
            }, 0);
        };
        var this_1 = this;
        for (var currency in this.currency.rates) {
            _loop_1(currency);
        }
    };
    Cart.prototype.setTotalPrice = function () {
        this.totalPriceElement.textContent = "".concat(this.currency.getCurrentSymbol(), " ").concat(util_1.Util.getCorrectPrice(this.totalPrices[this.currency.currentValue]));
    };
    Cart.prototype.changeCurrency = function () {
        var _this = this;
        this.items.forEach(function (item) {
            item.changeCurrency(_this.currency.currentValue, _this.currency.getCurrentSymbol());
        });
        this.setTotalPrice();
    };
    return Cart;
}());
exports.Cart = Cart;


/***/ }),

/***/ 859:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Currency = void 0;
var util_1 = __webpack_require__(483);
var Currency = /** @class */ (function () {
    function Currency(currencies, initialValue) {
        this.currencies = currencies;
        this.currentValue = initialValue;
        this.configireSelectElement();
        this.getRates();
    }
    Currency.prototype.setRatesCallback = function (ratesCallback) {
        this.ratesCallback = ratesCallback;
    };
    Currency.prototype.setChangeCallback = function (changeCallback) {
        this.changeCallback = changeCallback;
    };
    Currency.prototype.configireSelectElement = function () {
        var e_1, _a;
        var _this = this;
        var selectElement = document.getElementById('select');
        var fragment = new DocumentFragment();
        try {
            for (var _b = __values(this.currencies.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var currency = _c.value;
                var optionElement = new Option(currency, currency, null, currency === this.currentValue);
                fragment.append(optionElement);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        selectElement.append(fragment);
        selectElement.addEventListener('change', function () {
            _this.onChange(selectElement.value);
        });
    };
    Currency.prototype.onChange = function (currency) {
        this.currentValue = currency;
        this.changeCallback();
    };
    Currency.prototype.getRates = function () {
        var e_2, _a;
        var _this = this;
        var promises = [];
        try {
            for (var _b = __values(this.currencies.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var currency = _c.value;
                promises.push(this.fetchRate(currency));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        Promise.all(promises)
            .then(function (values) {
            _this.rates = {};
            values.forEach(function (value) {
                _this.rates[value[0]] = value[1];
            });
            _this.ratesCallback();
        })
            .catch(function () {
            util_1.Util.showError();
        });
    };
    Currency.prototype.fetchRate = function (currency) {
        if (currency === this.currentValue) {
            return Promise.resolve([this.currentValue, 1]);
        }
        var prop = "".concat(this.getIso(this.currentValue), "_").concat(this.getIso(currency));
        return fetch("https://free.currconv.com/api/v7/convert?q=".concat(prop, "&compact=ultra&apiKey=64c7419f27e34b7a148a"))
            .then(function (response) {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error();
        })
            .then(function (data) {
            return [currency, +data[prop]];
        });
    };
    Currency.prototype.getIso = function (currency) {
        return this.currencies.get(currency).iso;
    };
    Currency.prototype.getCurrentSymbol = function () {
        return this.currencies.get(this.currentValue).symbol;
    };
    return Currency;
}());
exports.Currency = Currency;


/***/ }),

/***/ 915:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CURRENCIES = exports.INITIAL_CURRENCY = exports.CART_ITEMS = void 0;
exports.CART_ITEMS = [
    { name: 'Item1', price: 20 },
    { name: 'Item2', price: 45 },
    { name: 'Item3', price: 67 },
    { name: 'Item4', price: 1305 },
];
exports.INITIAL_CURRENCY = 'dollars';
exports.CURRENCIES = new Map([
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


/***/ }),

/***/ 483:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Util = void 0;
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.getCorrectPrice = function (price) {
        return price.toFixed(2);
    };
    Util.hideLoader = function () {
        var loaderElement = document.getElementById('loader');
        loaderElement.classList.remove('visible');
    };
    Util.showError = function () {
        var errorElement = document.getElementById('error');
        errorElement.classList.add('visible');
    };
    return Util;
}());
exports.Util = Util;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var exports = {};
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
var cart_1 = __webpack_require__(92);
var constants_1 = __webpack_require__(915);
var App = /** @class */ (function () {
    function App() {
    }
    App.init = function () {
        var cart = new cart_1.Cart(constants_1.CART_ITEMS, constants_1.CURRENCIES, constants_1.INITIAL_CURRENCY);
    };
    return App;
}());
App.init();

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
// extracted by mini-css-extract-plugin

})();

/******/ })()
;