import React, { useEffect,useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Container,Form, Alert  } from 'react-bootstrap'
import Rating from '../Rating'
import { listProductDetails,createProductReview } from '../../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../../constants/productConstants'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader'
import Message from '../Message'
import { addToWishlist } from '../../actions/wishlistActions'



function ProductScreen({ params }) {
    const navigate=useNavigate()
    const location=useLocation()
    const { id } = useParams()
    const [qty,setQty]=useState(1)

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [hoveredStar, setHoveredStar] = useState(0)

    const dispatch = useDispatch()
    const productDetails = useSelector((state) => state.productDetails)
    const { error, loading, product } = productDetails

    
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector((state) => state.productReviewCreate)
    const { success: successReview, error: errorReview, loading: loadingReview } = productReviewCreate


    useEffect(() => {
        if (successReview) {
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
            return () => dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }
            dispatch(listProductDetails(id))

    }, [dispatch, id,successReview]);
    const addToCartHandler=()=>{
        navigate(`/cart/${id}?qty=${qty}`)
    }
    const addToWishlistHandler = () => {
    dispatch(addToWishlist(id)) // id is already pulled from useParams()
    }

    const submitReviewHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(id, {
        rating,
        comment
    }))
    }


    return (
        <Container>
            <div>
                <Link to="/" className='btn btn-dark my-3'>
                    Go back
                </Link>
                {loading ? (
                    <Loader />

                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <>
                    <Row>
                        <Col md={4}>
                            <Image src={`http://127.0.0.1:8000${product.image}`} alt={product.name} fluid rounded/>
                        </Col>

                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>{product.productname}</h3>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Rating
                                        value={product.rating}
                                        text={`${product.numReviews} reviews`}
                                        color={"#f8e825"}
                                    />
                                </ListGroup.Item>


                                <ListGroup.Item>
                                    Description: {product.productinfo}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={3}>
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>₹{product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                {product.stockcount > 0 ? "In Stock" : "Out of Stock"}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {product.stockcount > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col xs="auto" className="my-1">
                                                    <Form.Control
                                                        as="select"
                                                        value={qty}
                                                        onChange={(e) => setQty(e.target.value)}
                                                    >
                                                        {[...Array(product.stockcount).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}
                                    <ListGroup.Item>
                                        <Button
                                            className='btn-block btn-success' disabled={product.stockcount == 0} type='button' onClick={addToCartHandler}>
                                            Add to Cart</Button>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                         <Button
                                             onClick={addToWishlistHandler}
                                             className='btn-block'
                                             variant='outline-danger'
                                             type='button'
                                         >
                                             <i className='fa-solid fa-heart'></i> Wishlist
                                         </Button>
                                          </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                        </Row>

                         <Row className='mt-5'>
                            <Col md={5}>
                                <h2>Reviews</h2>
                                <>

                                {product.reviews && product.reviews.length === 0 && (
                                    <Alert variant='info'>No reviews yet. Be the first to review!</Alert>
                                )}

                                <ListGroup variant='flush'>
                                    {product.reviews && product.reviews.map((review) => (
                                        <ListGroup.Item key={review.id}>
                                            <strong>{review.name}</strong>
                                            <div>
                                                {[1,2,3,4,5].map((star) => (
                                                    <span key={star} style={{
                                                        color: star <= review.rating ? '#f8e825' : '#e4e5e9',
                                                        fontSize: '1.2rem'
                                                    }}>★</span>
                                                ))}
                                            </div>
                                            <p className='text-muted small'>
                                                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                </>

                                {/* Write Review Form */}
                                <ListGroup.Item className='mt-3'>
                                    <h3>Write a Review</h3>

                                    {errorReview && <Alert variant='danger'>{errorReview}</Alert>}
                                    {successReview && <Alert variant='success'>Review submitted!</Alert>}

                                    {userInfo ? (
                                        <div>
                                            {/* ⭐ Star Selector */}
                                            <div className='mb-3'>
                                                <p><strong>Your Rating:</strong></p>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoveredStar(star)}
                                                        onMouseLeave={() => setHoveredStar(0)}
                                                        style={{
                                                            fontSize: '2.5rem',
                                                            cursor: 'pointer',
                                                            color: star <= (hoveredStar || rating)
                                                                ? '#f8e825' : '#e4e5e9',
                                                            transition: 'color 0.1s'
                                                        }}
                                                    >★</span>
                                                ))}
                                                {rating > 0 && (
                                                    <span className='ms-2 text-muted'>
                                                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                                                    </span>
                                                )}
                                            </div>

                                            <Form.Group className='mb-3'>
                                                <Form.Label><strong>Your Review:</strong></Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    rows={4}
                                                    placeholder='Share your experience with this product...'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                />
                                            </Form.Group>

                                            <Button
                                                onClick={submitReviewHandler}
                                                className='btn btn-primary'
                                                disabled={rating === 0 || !comment || loadingReview}
                                            >
                                                {loadingReview ? 'Submitting...' : 'Submit Review'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Alert variant='info'>
                                            Please <Link to='/login'>login</Link> to write a review
                                        </Alert>
                                    )}
                                </ListGroup.Item>
                            </Col>
                        </Row>
                        </>
                        

                        








                    
                )}




            </div>
        </Container>
    )
}

export default ProductScreen