import {cart, removeFromCart, updateDeliveryOption, updateQuantity, getItem} from '../../data/cart.js';
import{products,getProduct} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';  
import {deliveryOptions,getDeliveryOption} from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummay.js';

export function renderOrderSummary(){
    let cartSummaryHTML='';

    if (cart.length === 0){
      cartSummaryHTML =`
      <div data-testid="empty-cart-message">
        Your cart is empty.
      </div>
      <a class="button-primary view-products-link" href="amazon.html" data-testid="view-products-link">
        View products
      </a>
      `;
    };

    cart.forEach((cartItem)=>{
      const productId = cartItem.productId;
      const matchingProduct = getProduct(productId);
      const deliveryOptionId = cartItem.deliveryOptionId;
      const deliveryOption = getDeliveryOption(deliveryOptionId);

      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      

      cartSummaryHTML+=
        `
          <div class="cart-item-container js-cart-item-container 
          js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id = "${matchingProduct.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${matchingProduct.id}" type = "number" min = "1" value = "${cartItem.quantity}">
                  <span class="save-quantity-link link-primary js-save-link"
                  data-product-id="${matchingProduct.id}">
                  Save
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id = "${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
          `;
    });

    function deliveryOptionsHTML(matchingProduct,cartItem){
      let html = '';
      deliveryOptions.forEach((deliveryOption)=>{
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `${formatCurrency(deliveryOption.priceCents)} - `

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
        html+=`<div class="delivery-option js-delivery-option"
        data-product-id = "${matchingProduct.id}"
        data-delivery-option-id = "${deliveryOption.id}">
          <input type="radio" 
          ${isChecked ? 'checked': ''}
          class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              $${priceString} - Shipping
            </div>
          </div>
        </div>`;
      })
      return html;
    }

    document.querySelector('.js-order-summary').innerHTML =   cartSummaryHTML;

    document.querySelectorAll('.js-delivery-option').forEach((element)=>
      {
        element.addEventListener('click', ()=>{
          const {productId, deliveryOptionId} = element.dataset;
          updateDeliveryOption(productId, deliveryOptionId);
          renderOrderSummary();
          renderPaymentSummary();
        });
      });
  

    document.querySelectorAll('.js-delete-link').forEach((link)=>{
      link.addEventListener('click',()=>{
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
        if (cart.length === 0) {
          renderOrderSummary(); // this will show the empty cart message
        }
        renderPaymentSummary();
      })
    });

    document.querySelectorAll('.js-update-link').forEach((link)=>{
      link.addEventListener('click',()=>{
        const productId = link.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');})
      });

    

    document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        let newQuantity = getItem(productId).quantity;
  
        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');

        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );
        if (Number(quantityInput.value)<0){
          alert("This is not a valid input");
  
        }else if(Number(quantityInput.value)===0){
          removeFromCart(productId);
          const container = document.querySelector(`.js-cart-item-container-${productId}`);
          container.remove();
          renderPaymentSummary();

        }else{
          newQuantity = Number(quantityInput.value);
          updateQuantity(productId, newQuantity);
        }
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

  }



              