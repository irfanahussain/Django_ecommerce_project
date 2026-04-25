import React, { useEffect } from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listMyOrders } from '../../actions/orderActions'
import Loader from '../../components/Loader'
import Message from '../../components/Message'

function MyOrdersScreen() {
    const dispatch = useDispatch()

    const orderListMy = useSelector(state => state.orderListMy)
    const { loading, error, orders } = orderListMy

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (userInfo) {
            dispatch(listMyOrders())
        }
    }, [dispatch, userInfo])
    useEffect(() => {
    console.log("userInfo:", userInfo)
    console.log("orders:", orders)
}, [orders])

    return (
        <Row>
            <Col md={12}>
                <h2>My Orders</h2>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <Table striped responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
    {orders && orders.map(order => (
        <tr key={order.id || order._id}> {/* Support both id formats */}
            <td>{order.id || order._id}</td>
            <td>{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</td>
            <td>₹{order.totalPrice}</td>
            <td>{order.isPaid && order.paidAt ? (
                order.paidAt.substring(0, 10)
            ) : (
                <i className='fas fa-times' style={{ color: 'red' }}></i>
            )}</td>
            <td>{order.isDelivered && order.deliveredAt ? (
                order.deliveredAt.substring(0, 10)
            ) : (
                <i className='fas fa-times' style={{ color: 'red' }}></i>
            )}</td>
            <td>
                <LinkContainer to={`/order/${order.id}`}>
                    <Button className='btn-sm'>Details</Button>
                </LinkContainer>
            </td>
        </tr>
    ))}
</tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
}

export default MyOrdersScreen