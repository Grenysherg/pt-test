export class Util {
  static getCorrectPrice(price: number) {
    return price.toFixed(2);
  }

  static hideLoader() {
    const loaderElement = document.getElementById('loader');
    loaderElement.classList.remove('visible');
  }

  static showError() {
    const errorElement = document.getElementById('error');
    errorElement.classList.add('visible');
  }
}
