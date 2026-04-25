import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { createOrder } from '../../actions/orderActions'
import { ORDER_CREATE_RESET } from '../../constants/orderConstants'
import CheckoutSteps from '../checkout/CheckoutSteps'

function PlaceOrderScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector((state) => state.cart)
    // FIX 1: Add fallbacks to prevent "Cannot read properties of undefined"
    const { shippingAddress = {}, cartItems = [] } = cart


    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping')
        }
    }, [shippingAddress, navigate])

    // Calculate Prices - Pure numbers first, then format
    const itemsPriceRaw = cart.cartItems.reduce((acc, item) => {
    const quantity =Number(item.qty) ||1;
    const price=Number(item.price) || 0;
    return acc + item.price * quantity;
    }, 0);
    const shippingPriceRaw = itemsPriceRaw > 500 ? 0 : 50
    const totalPriceRaw = itemsPriceRaw + shippingPriceRaw

    // Calculate Prices
    const itemsPrice = itemsPriceRaw.toFixed(2)
    const shippingPrice = shippingPriceRaw.toFixed(2)
    const totalPrice = totalPriceRaw.toFixed(2)

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    useEffect(() => {
    if (success && order) {
        navigate(`/order/${order.id}`)
        dispatch({ type: ORDER_CREATE_RESET })
    }
}, [success, navigate, order, dispatch])

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress:cart.shippingAddress,
            paymentMethod: 'Razorpay',
            itemsPrice:itemsPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
        }))
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {/* FIX 3: Use optional chaining to safely read address details */}
                                {shippingAddress?.address}, {shippingAddress?.city} {' '}
                                {shippingAddress?.postalCode}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cartItems.length === 0 ? <p>Your cart is empty</p> : (
                                <ListGroup variant='flush'>
                                    {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={`http://127.0.0.1:8000${item.image}`} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>₹{itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>₹{shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>₹{totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {error && <ListGroup.Item className="text-danger">{error}</ListGroup.Item>}

                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cart.cartItems.length === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen