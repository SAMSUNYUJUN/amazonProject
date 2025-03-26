import {cart as cart, addToCart} from '../data/cart.js'; //create your own name to avoid naming conflict.

import{products, loadProducts} from '../data/products.js';
import { formatCurrency } from './utils/money.js';

loadProducts(renderProductsGrid);
function renderProductsGrid(){
  let productHTML = '';
    const url = new URL(window.location.href);
    const search = url.searchParams.get('search');

    let filteredProducts = products;

    // If a search exists in the URL parameters,
    // filter the products that match the search.
    if (search) {
      filteredProducts = products.filter((product) => {
        let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyword = true;
        }
      });

      return matchingKeyword ||
        product.name.toLowerCase().includes(search.toLowerCase());
      });
    }
    filteredProducts.forEach((product) => {
    productHTML  += `
        <div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>

            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${product.getStarsUrl()}">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
              <select class = "js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            ${product.extraInfoHTML()}

            <div class="js-added-to-cart-message added-to-cart-message" data-product-id="${product.id}">
            <img src="images/icons/checkmark.png" class="added-to-cart-message-img">
            Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart"
            data-product-id="${product.id}">
              Add to Cart
            </button>
          </div> 
    `;
  });

  document.querySelector('.js-products-grid').innerHTML = productHTML;


  updateCartQuantity();

  function updateCartQuantity(){
    let cartQuantity = 0;
      cart.forEach((cartItem)=>{
        cartQuantity+=cartItem.quantity;
      });
      document.querySelector('.js-cart-quantity').textContent = cartQuantity;
  }

  document.querySelectorAll('.js-add-to-cart').forEach((button)=>{
      button.addEventListener('click',()=>{
        const productId = button.dataset.productId;
        for (let i = 0 ; i<parseInt(document.querySelector(`.js-quantity-selector-${productId}`).value,10); i++){
          addToCart(productId);
        };
        const message = document.querySelector(`.js-added-to-cart-message[data-product-id="${productId}"]`);
        if (message) {
           message.style.opacity = '1';

          // Optionally, hide it again after a delay (e.g., 2 seconds)
        setTimeout(() => {
          message.style.opacity = '0';
          }, 2000);
       }
        updateCartQuantity();
      });
  });

  document.querySelector('.js-search-button')
  .addEventListener('click', () => {
    const search = document.querySelector('.js-search-bar').value;
    window.location.href = `amazon.html?search=${search}`;
  });

  
  // Extra feature: searching by pressing "Enter" on the keyboard.
  document.querySelector('.js-search-bar')
  .addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const searchTerm = document.querySelector('.js-search-bar').value;
      window.location.href = `amazon.html?search=${searchTerm}`;
    }
  });
}


