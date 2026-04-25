import axios from 'axios'
import { ORDER_CREATE_REQUEST,
         ORDER_CREATE_SUCCESS,
         ORDER_CREATE_FAIL,
         ORDER_CREATE_RESET } from '../constants/orderConstants'
import { 
    ORDER_DETAILS_REQUEST, 
    ORDER_DETAILS_SUCCESS, 
    ORDER_DETAILS_FAIL 
} from '../constants/orderConstants'
import { 
    ORDER_PAY_REQUEST, 
    ORDER_PAY_SUCCESS, 
    ORDER_PAY_FAIL 
} from '../constants/orderConstants'

import { 
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL 
} from '../constants/orderConstants'

import {
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
} from '../constants/orderConstants'


export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST })

        const { userLogin: { userInfo } } = getState()

        console.log("Sending Token:",JSON.parse(localStorage.getItem('userInfo')).access)


        const config = {
            headers: {
             'Content-type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).access}` 
            }
        }

        
        const { data } = await axios.post('http://127.0.0.1:8000/orders/add/', order, config)

        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data })

    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo?.access}`
            }
        }

        // This matches path('orders/<str:pk>/', ...) in your urls.py
        const { data } = await axios.get(`http://127.0.0.1:8000/orders/${id}/`, config)

        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data })

    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_PAY_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo?.access}`
            }
        }

        // This calls your backend view that updates isPaid to True
        const { data } = await axios.put(
            `http://127.0.0.1:8000/orders/${id}/pay/`, 
            paymentResult, 
            config
        )

        dispatch({ type: ORDER_PAY_SUCCESS, payload: data })

    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const deliverOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DELIVER_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo?.access}`
            }
        }

        const { data } = await axios.put(
            `http://127.0.0.1:8000/orders/${id}/deliver/`,
            {},
            config
        )

        dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data })

    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_LIST_MY_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                // Change .token to .access to match your other actions
                Authorization: `Bearer ${userInfo.access}` 
            }
        }

        // Ensure this URL matches your Django urls.py exactly
        const { data } = await axios.get(`http://127.0.0.1:8000/orders/myorders/`, config)

        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data
        })
    } catch (error) {
        // ... error handling remains same
    }
}