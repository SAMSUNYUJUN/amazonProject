import { renderOrderSummary } from './checkout/orderSummay.js';
import {renderPaymentSummary} from  './checkout/paymentSummay.js';
import {loadProducts, loadProductsFetch} from '../data/products.js';
import {loadCart, loadCartFetch} from '../data/cart.js'
//import '../data/cart-class.js';
//import '../data/backend-practice.js';


async function loadPage(){
  try {
    //throw 'error1';

    await loadProductsFetch();
    await loadCartFetch();

  } catch (error){
    console.log('unexpected error, please try again later.');
  }
  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();

/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve)=>{
    loadCart(()=>{
      resolve();
    })
  })

]).then(()=>{
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/*
new Promise((resolve)=>{
  loadProducts(()=>{
    resolve('value1');
  });
}).then((value)=>{
  console.log(value);
  return new Promise((resolve)=>{
    loadCart(()=>{
      resolve();
    })
  })
}).then(()=>{
  renderOrderSummary();
  renderPaymentSummary();
});
*/
/*
loadProducts(()=>{
  loadCart(()=>{
    renderOrderSummary();
    renderPaymentSummary();
  })
})
*/


/*
loadProducts(()=>{
  renderOrderSummary();
  renderPaymentSummary();
});
*/