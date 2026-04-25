import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../../actions/cartActions'
import CheckoutSteps from '../checkout/CheckoutSteps'

function PaymentScreen() {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const navigate = useNavigate()
    const dispatch = useDispatch()

    if (!shippingAddress.address) {
        navigate('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('Razorpay')

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 />
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label='Razorpay'
                            id='Razorpay'
                            name='paymentMethod'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary' className='mt-3'>
                    Continue
                </Button>
            </Form>
        </div>
    )
}

export default PaymentScreen