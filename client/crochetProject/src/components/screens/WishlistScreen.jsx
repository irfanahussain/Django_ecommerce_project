import React,{useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Row, Col,Card,Button } from 'react-bootstrap';
import Rating from '../Rating';
import Message from '../Message';
import Product from '../Product';
import { Link } from 'react-router';
import { removeFromWishlist } from '../../actions/wishlistActions';

function WishlistScreen() {
    const dispatch=useDispatch()
    const wishlist = useSelector((state) => state.wishlist);
    const { wishlistItems } = wishlist;
    const removeFromWishlistHandler=(id)=>{
        dispatch(removeFromWishlist(id))
    }


    return (
        <div>
            <h2>My Wishlist</h2>
            {wishlistItems.length === 0 ? (
                <Message variant='info'>Your wishlist is empty</Message>
            ) : (
                <Row>
                    {wishlistItems.map((item) => (
                        <Col key={item.product} sm={12} md={3} lg={2}>
        <Card className="my-3 p-2 rounded">
            <Link to={`/product/${item.product}`}>
                <Card.Img src={`http://127.0.0.1:8000${item.image}`} variant="top" />
            </Link>

            {/* --- PASTE YOUR CODE STARTING HERE --- */}
            <Card.Body>
                <Link to={`/product/${item.product}`}>
                    <Card.Title as="div">
                        <strong>{item.name}</strong> 
                    </Card.Title>
                </Link>

                

                <Card.Text as="h3">₹{item.price}</Card.Text>

                <Button 
                    type='button' 
                    variant='light' 
                    onClick={() => removeFromWishlistHandler(item.product)}
                >
                    <i className='fas fa-trash' style={{color: 'blue'}}></i> Remove
                </Button>
            </Card.Body>
            {/* --- PASTE YOUR CODE ENDING HERE --- */}

        </Card>
    </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}

export default WishlistScreen;