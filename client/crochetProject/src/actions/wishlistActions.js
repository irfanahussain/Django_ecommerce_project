import axios from 'axios'
import { WISHLIST_ADD_ITEM, WISHLIST_REMOVE_ITEM } from '../constants/wishlistConstants'

export const addToWishlist = (id) => async (dispatch, getState) => {
    const { data } = await axios.get(`http://127.0.0.1:8000/product/${id}`)

    dispatch({
        type: WISHLIST_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.productname,
            image: data.image,
            price: data.price,
            countInStock: data.stockcount,
        },
    })

    localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlistItems))
}

export const removeFromWishlist = (id) => (dispatch, getState) => {
    dispatch({
        type: WISHLIST_REMOVE_ITEM,
        payload: id,
    })

    localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlistItems))
}