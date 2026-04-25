import { createStore,combineReducers,applyMiddleware } from 'redux'
import {thunk} from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productDetailsReducers, productReviewCreateReducer, productsListReducers } from './reducers/productReducers'
import { userLoginReducers,userSignupReducers} from './reducers/userReducers'
import { cartReducer } from './reducers/cartReducers'
import { wishlistReducer } from './reducers/wishlistReducers'
import { categoryListReducer } from './reducers/categoryReducers' 
import { orderCreateReducer, orderDeliverReducer, orderDetailsReducer, orderPayReducer,orderListMyReducer } from './reducers/orderReducers'













const reducer = combineReducers({
    productsList:productsListReducers,
    productDetails:productDetailsReducers,
    userLogin:userLoginReducers,
    userSignup:userSignupReducers,
    cart:cartReducer,
    wishlist: wishlistReducer,
    categoryList: categoryListReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay:orderPayReducer,
    orderDeliver: orderDeliverReducer,
    productReviewCreate: productReviewCreateReducer,
    orderListMy: orderListMyReducer, 
      
})

const cartItemFromStorage=localStorage.getItem('cartItems')?
JSON.parse(localStorage.getItem('cartItems')):[]
const wishlistItemsFromStorage = localStorage.getItem('wishlistItems') 
    ? JSON.parse(localStorage.getItem('wishlistItems')) : []

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {}
const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

const initialState = {
    cart: { 
        cartItems: cartItemFromStorage,
        shippingAddress: shippingAddressFromStorage, 
    },
    wishlist: { wishlistItems: wishlistItemsFromStorage },
    userLogin: { userInfo: userInfoFromStorage },
}
const middleware=[thunk]
const store=createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))

export default store