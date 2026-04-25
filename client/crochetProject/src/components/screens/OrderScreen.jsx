import React, { useState, useEffect } from 'react'
import { Row, Col, ListGroup, Image, Card, Alert } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, payOrder,deliverOrder } from '../../actions/orderActions'
import { ORDER_PAY_RESET,ORDER_DELIVER_RESET } from '../../constants/orderConstants'


function OrderScreen() {
    const { id: orderId } = useParams()
    const dispatch = useDispatch()

    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector((state) => state.orderPay)
    const { success: successPay } = orderPay

    const orderDeliver = useSelector((state) => state.orderDeliver) 
    const { success: successDeliver } = orderDeliver

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    // Logic to calculate items price if not returned by backend
    if (order && !loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    useEffect(() => {
    
    const orderIdMatch = order && order.id === Number(orderId);

    if (!order || successPay || !orderIdMatch) {
        if (successPay) {
            dispatch({ type: ORDER_PAY_RESET });
        }
        if (successDeliver) dispatch({ type: ORDER_DELIVER_RESET })
        dispatch(getOrderDetails(orderId));
    }
}, [dispatch, orderId, successPay,successDeliver, order]); 

const payHandler = () => {
        const options = {
            key: "rzp_test_SdradBFEBWigC6", 
            amount: order.totalPrice * 100, // Amount is in paise
            currency: "INR",
            name: "YarnNest",
            description: "Payment for your crochet order",
            handler: function (response) {
                const paymentData={
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                }
                // This dispatches the actual payment update to your backend
                dispatch(payOrder(orderId, paymentData))
            },
            prefill: {
                name: userInfo ? userInfo.name : order.user.first_name,
                email: userInfo ? userInfo.email : order.user.email,
            },
            theme: {
                color: "#ffc0cb",
            },
        };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
}
   
    const deliverHandler = () => {
        dispatch(deliverOrder(orderId))
    }

    

    return loading ? (
        <h2>Loading...</h2>
    ) : error ? (
        <Alert variant='danger'>{error}</Alert>
    ) : (
        <div>
            <h1>Order: {order.id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {order.user.first_name}</p>
                            <p><strong>Email: </strong> {order.user.email}</p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.postalCode}
                            </p>
                                    {order.isDelivered ? (
                            <Alert variant='success'>
                                Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                     month: 'long',
                                      year: 'numeric'
                                })}
                            </Alert>
                            ) : (
                                <Alert variant='warning'>Not Delivered</Alert>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p><strong>Method: </strong> {order.paymentMethod}</p>
                            {order.isPaid ? (
                                <Alert variant='success'>Paid on {order.paidAt}</Alert>
                            ) : (
                                <Alert variant='danger'>Not Paid</Alert>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image  src={`http://127.0.0.1:8000${item.image}`} alt={item.name} 
                                                fluid rounded />
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
                                    <Col>₹{order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>₹{order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>₹{order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            
                            
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    <button onClick={payHandler} className='btn btn-primary w-100'>Pay with Razorpay</button>
                                </ListGroup.Item>
                            )}


                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <button onClick={deliverHandler} className='btn btn-success w-100'>
                                        Mark As Delivered
                                    </button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen