import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, message, Spin, InputNumber } from "antd";
import React from "react";
import { config } from "../App";
import "./Cart.css";

/**
 * @typedef {Object} Product
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem
 * @property {string} productId - Unique ID for the product
 * @property {number} qty - Quantity of the product in cart
 * @property {Product} product - Corresponding product object for that cart item
 */

/**
 * @class Cart component handles functionality for the display and manipulation of the customer's shopping cart
 * 
 * Contains the following fields
 * @property {Product[]} props.products 
 *    List of all available products (that the cart items can be from)
 * @property {{ push: function }} props.history 
 *    To navigate and redirect the user to different routes or pages
 * @property {string} props.token 
 *    Oauth token for authentication for API calls
 * @property {boolean|undefined} props.checkout 
 *    Denotes if the Cart component is created in the Checkout component
 * @property {CartItem[]} state.items 
 *    List of items currently in cart
 * @property {boolean} state.loading 
 *    Indicates background action pending completion. When true, further UI actions might be blocked
 */
export default class Cart extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      loading: false,
    };
  }
 

  /**
   * Check the response of the API call to be valid and handle any failures along the way
   *
   * @param {boolean} errored
   *    Represents whether an error occurred in the process of making the API call itself
   * @param {{ productId: string, qty: number }|{ success: boolean, message?: string }} response
   *    The response JSON object which may contain further success or error messages
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * If the API call itself encounters an error, errored flag will be true.
   * If the backend returns an error, then success field will be false and message field will have a string with error details to be displayed.
   * When there is an error in the API call itself, display a generic error message and return false.
   * When there is an error returned by backend, display the given message field and return false.
   * When there is no error and API call is successful, return true.
   */
  validateResponse = (errored, response) => {
    if (errored) {
      message.error(
        "Could not update cart. Check that the backend is running, reachable and returns valid JSON."
      );
      return false;
    }

    if (response.message) {
      message.error(response.message);
      return false;
    }

    return true;
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @returns {{ productId: string, qty: number }|{ success: boolean, message?: string }}
   *    The response JSON object
   *
   * -    Set the loading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must be authenticated with an authorization header containing Oauth token
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the loading state variable to false once the call has completed
   * -    Call the validateResponse(errored, response) function defined previously
   * -    If response passes validation, return the response object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  getCart = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass the OAuth token (check supported props in Cart class documentation) in the fetch API call as an Authorization header
      let bearer='Bearer '+this.props.token
      response = await (
        await fetch(`${config.endpoint}/cart`, {
          method: "GET",
          headers:{
            'Authorization': bearer,
            'Content-Type': 'application/json'
          }
        })
      ).json();
    } catch (e) {
      errored = true;
    }

    this.setState({
      loading: false,
    });

    if (this.validateResponse(errored, response)) {
      return response;
    }
  };

  /**
   * Perform the API call to add or update items in the user's cart
   *
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} fromAddToCartButton
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * -    If the user is trying to add from the product card and the product already exists in cart, show an error message
   * -    Set the loading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must be authenticated with an authorization header containing Oauth token
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the loading state variable to false once the call has completed
   * -    Call the validateResponse(errored, response) function defined previously
   * -    If response passes validation, refresh the cart by calling refreshCart()
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *      "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 404
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  pushToCart = async (productId, qty, fromAddToCartButton) => {
    if (fromAddToCartButton) {
      for (const item of this.state.items) {
        if (item.productId === productId) {
          message.error(
            "Item already added to cart. Use the cart sidebar to update quantity or remove item."
          );
          return;
        }
      }
    }

    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      let bearer='Bearer '+this.props.token
      // TODO: CRIO_TASK_MODULE_CART - Make an authenticated POST request to "/cart". JSON with properties - productId, qty are to be sent in the request body
      response = await (
        await fetch(`${config.endpoint}/cart`, {
          method:'POST',
          headers:{
            'Authorization':bearer,
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            productId:productId,
            qty:qty
          })
        })
      ).json();
    } catch (e) {
      console.log('any error')
      errored = true;
    }

   

    if (this.validateResponse(errored, response)) {
      await this.refreshCart()
    }
    this.setState({
      loading: false,
    });
  };

  /**
   * Function to get/refresh list of items in cart from backend and update state variable
   * -    Call the previously defined getCart() function asynchronously and capture the returned value in a variable
   * -    If the returned value exists,
   *      -   Update items state variable with the response (optionally add the corresponding product object of that item as a sub-field)
   * -    If the cart is being displayed from the checkout page, or the cart is empty,
   *      -   Display an error message
   *      -   Redirect the user to the products listing page
   */
  refreshCart = async () => {
    const cart = await this.getCart();
    
    if (cart) {
      this.setState({
        items: cart.map((item) => ({
          ...item,
          product: this.props.products.find(
            (product) => product._id === item.productId
          ),
        })),
      });
    }

    // TODO: CRIO_TASK_MODULE_CHECKOUT - If the user visits "/checkout" directly and cart is empty, display an error message and redirect to the "/products" page
  };

  /**
   * Function to calculate the total cost of items in cart
   * -    Iterate over objects and return the total cost by taking an cost of item in cart, multiplying it with its quantity and cumulatively adding to a total
   *
   * @returns {number}
   *  The final total cost of the user's shopping cart
   */
  calculateTotal = () => {
    return this.state.items.length
      ? this.state.items.reduce(
          (total, item) => total + (parseInt(item.product.cost) * parseInt(item.qty)),
          0
        )
      : 0;
  };

  // TODO: CRIO_TASK_MODULE_CART - Implement a lifecycle method to populate the Cart when page is loaded
  /**
   * Function that runs when component has loaded
   * This is the function that is called when the page loads the cart component
   * We can call refreshCart() here to get the cart items
   */
  componentDidMount(){
    this.refreshCart()
    // if(this.state.items.length===0){
    //   this.props.history.push('/products')
    // }
  }

  // TODO: CRIO_TASK_MODULE_CART - Implement getQuantityElement(). If props.checkout is not set, display a Input field.
  /**
   * Creates the view for the product quantity added to cart
   *
   * @param {CartItem} item
   * @returns {JSX}
   *    HTML and JSX to be rendered
   */
  // getQuantityElement = (item) => {
  //   if(window.location.pathname==="/products"){
  //   if(this.props.checkout){
  //    return  <div className="cart-item-qty-fixed"></div>
  //   }
  //   else{
  //     // let arr=[0,1,2,3,4,5,6,7,8,9,10]
  //    return  <div>
  //      <InputNumber min={1} max={10} defaultValue={item.qty} onChange={(value) => {
  //           this.pushToCart(item.productId, value, false)          
  //         }} />
  //     </div>
  //   }
  // }
  // else if(window.location.pathname==="/checkout"){
  //   return(
  //     <>
  //     Qty:{item.qty}
  //     </>
  //   )
  // }
  // };

  /*
  try like this:*/
  getQuantityElement = (item) => {
    if(window.location.pathname === "/products") {
      if(this.props.checkout) {
        return (
          <div className="cart-item-qty-fixed"></div>
        );
      }
      else {
        return (
          <InputNumber min={1} max={10} defaultValue={item.qty} onChange={(value) => {
            this.pushToCart(item.productId, value, false)          
          }} />
        );
      }
    }
    else if(window.location.pathname === "/checkout") {
      return (
        <>
          Qty: {item.qty}
        </>
      );
    }
  };
  
  

  handleCheckout=()=>{
    this.state.items.length>0?this.props.history.push('/checkout'):
    message.info('you should add some items first')
  }

  /**
   * JSX and HTML goes here
   * To iterate over the cart items list and display each item as a component
   * -    Should display name, image, cost
   * -    Should have a way to select and update the quantity of the item
   * Total cost of all items needs to be displayed as well
   * We also need a button to take the user to the checkout page
   * If cart items do not exist, show appropriate text
   */
  render() {
    return (
      <div
        className={["cart", this.props.checkout ? "checkout" : ""].join(" ")}
      >
        {/* Display cart items or a text banner if cart is empty */}
        {this.state.items.length ? (
          <>
            {/* Display a card view for each product in the cart */}
            {this.state.items.map((item) => (
              <Card className="cart-item" key={item.productId}>
                {/* Display product image */}
                <img
                  className="cart-item-image"
                  alt={item.product.name}
                  src={item.product.image}
                />

                {/* Display product details*/}
                <div className="cart-parent">
                  {/* Display product name, category and total cost */}
                  <div className="cart-item-info">
                    <div>
                      <div className="cart-item-name">{item.product.name}</div>

                      <div className="cart-item-category">
                        {item.product.category}
                      </div>
                    </div>

                    <div className="cart-item-cost">
                      ₹{item.product.cost * item.qty}
                    </div>
                  </div>

                  {/* Display field to update quantity or a static quantity text */}
                  <div className="cart-item-qty">
                    {/* TODO: CRIO_TASK_MODULE_CART - Implement getQuantityElement() method */}
                    {this.getQuantityElement(item)}
                  </div>
                </div>
              </Card>
            ))}

            {/* Display cart summary */}
            <div className="total">
              <h2>Total</h2>

              {/* Display net quantity of items in the cart */}
              <div className="total-item">
                <div>Products</div>
                <div>
                  {this.state.items.reduce(function (sum, item) {
                    return parseInt(sum) + parseInt(item.qty);
                  }, 0)}
                </div>
              </div>

              {/* Display the total cost of items in the cart */}
              <div className="total-item">
                <div>Sub Total</div>
                <div>₹{this.calculateTotal()}</div>
              </div>

              {/* Display shipping cost */}
              <div className="total-item">
                <div>Shipping</div>
                <div>N/A</div>
              </div>
              <hr></hr>

              {/* Display the sum user has to pay while checking out */}
              <div className="total-item">
                <div>Total</div>
                <div>₹{this.calculateTotal()}</div>
              </div>
            </div>
          </>
        ) : (
          // Display a static text banner if cart is empty
          <div className="loading-text">
            Add an item to cart and it will show up here
            <br />
            <br />
          </div>
        )}

        {/* Display a "Checkout" button */}
        {/* TODO: CRIO_TASK_MODULE_CART - If props.checkout is not set, display a checkout button*/}
        {!this.props.checkout&&<Button className='check-out-btn' onClick={this.handleCheckout}><ShoppingCartOutlined />checkout</Button>}

        {/* Display a loading icon if the "loading" state variable is true */}
        {this.state.loading && (
          <div className="loading-overlay">
            <Spin size="large" />
          </div>
        )}
      </div>
    );
  }
}
