const Cart = require("../models/cart");
const Product = require("../models/product");

const cartService = {
  //DISPLAY CART
  handleDisplayCart: async (userId) => {
    let user_cart = await Cart.findOne({ user: userId }).populate({
      path: "listCart",
      populate: {
        path: "productId",
        model: "product",
      },
    });

    console.log("user_cart>> ", user_cart);
    return user_cart;
  },

  //ADD TO CART
  handleAddToCart: async (userId, idProduct) => {
    let user_cart;
    let cart;
    //Find cart with userID, not found => create
    user_cart = await Cart.findOne({ user: userId });
    if (user_cart) {
      cart = user_cart;
    } else {
      cart = new Cart({});
    }

    //add the product to the cart
    const product = await Product.findById(idProduct);
    let inventory = parseInt(product.inventory);

    let itemIndex = cart.listCart.findIndex((e) => {
      console.log("e.productId>> ", e.productId.toString(), idProduct);
      return e.productId.toString() === idProduct;
    });

    if (itemIndex > -1) {
      //if product exists in the cart, update the quantity
      if (inventory <= 0) {
        return cart;
      } else {
        cart.listCart[itemIndex].quantity++;
        cart.listCart[itemIndex].price =
          cart.listCart[itemIndex].quantity * parseInt(product.price);
        cart.totalQty++;
        cart.totalCost += parseInt(product.price);
        //decrease inventory of product when increase success
        inventory--;
      }
    } else {
      cart.listCart.push({
        productId: idProduct,
        quantity: 1,
        price: parseInt(product.price),
      });
      cart.totalQty++;
      cart.totalCost += parseInt(product.price);
      //decrease inventory of product when increase success
      inventory--;
    }

    //if the user is authenticated, store the user's id and save cart to the db
    product.inventory = String(inventory);
    await product.save();

    cart.user = userId;
    console.log("cart>>> ", cart);
    let data = await cart.save();
    return data;
  },

  //REDUCE TO CART
  handleReduceCart: async (userId, idProduct) => {
    let cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(idProduct);
    let inventory = parseInt(product.inventory);

    const itemIndex = cart.listCart.findIndex((e) => {
      console.log("e.productId>> ", e.productId.toString(), idProduct);
      return e.productId.toString() === idProduct;
    });
    if (itemIndex > -1) {
      cart.listCart[itemIndex].quantity--;
      cart.listCart[itemIndex].price -= parseInt(product.price);
      cart.totalQty--;
      cart.totalCost -= parseInt(product.price);
      //increase inventory of product when decrease success
      inventory++;

      // if the item's qty reaches 0, remove it from the cart
      if (cart.listCart[itemIndex].quantity <= 0) {
        await cart.listCart.remove({ _id: cart.listCart[itemIndex]._id });
      }
      product.inventory = String(inventory);
      await product.save();

      //Save the cart
      let data = await cart.save();

      //Delete cart if total product =0
      if (cart.totalQty <= 0) {
        await Cart.findByIdAndRemove(cart._id);
      }

      return data;
    } else {
      return;
    }
  },

  //REMOVE ALL
  handleRemoveSigle: async (userId, idProduct) => {
    let cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(idProduct);
    let inventory = parseInt(product.inventory);

    //find the item with idProduct
    let itemIndex = cart.listCart.findIndex((e) => {
      console.log("e.productId>> ", e.productId.toString(), idProduct);
      return e.productId.toString() === idProduct;
    });

    if (itemIndex > -1) {
      cart.totalQty -= cart.listCart[itemIndex].quantity;
      cart.totalCost -= cart.listCart[itemIndex].price;
      //increase inventory of product when decrease success
      inventory += cart.listCart[itemIndex].quantity;
      product.inventory = String(inventory);
      await product.save();
      //CART
      await cart.listCart.remove({ _id: cart.listCart[itemIndex]._id });
      let data = await cart.save();
      if (cart.totalQty <= 0) {
        await Cart.findByIdAndRemove(cart._id);
      }
      return data;
    } else {
      return;
    }
  },
};

module.exports = cartService;
