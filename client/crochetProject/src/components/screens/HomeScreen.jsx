import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Row, Col,Button,Container } from "react-bootstrap"
import Product from '../Product'
import { listProducts } from '../../actions/productActions'
import { useDispatch,useSelector } from 'react-redux'
import Loader from '../Loader'
import Message from '../Message'
import { listCategories } from '../../actions/categoryActions'






function HomeScreen() {


  const dispatch=useDispatch()

  const [selectedCategory, setSelectedCategory] = useState('All')

  const productsList=useSelector((state)=>state.productsList)
  const {error,loading,products}=productsList

  const categoryList = useSelector((state) => state.categoryList) 
  const { categories } = categoryList || {categories:[]}

  
  useEffect(() => {
    dispatch(listProducts())
    dispatch(listCategories())
  }, [dispatch]);
  console.log(products)

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products?.filter(p => p.category_name?.trim() === selectedCategory.trim())
    console.log("Filtered Products:",filteredProducts) 

  return (
    
    <Container>
      
      <div className="marquee">
        <p> Check out our new handmade Strawberry Charms! </p>
      </div>
      <br />
       <div className="d-flex flex-wrap mb-4 justify-content-center">
        <Button 
          variant={selectedCategory === 'All' ? 'dark' : 'outline-dark'} 
          className="m-1 rounded-pill"
          onClick={() => setSelectedCategory('All')}
        >
          All
        </Button>
        {categories && Array.isArray(categories) && categories.map((cat) => (
  <Button 
    key={cat.id || cat._id} // Use the correct ID field from your DB
    variant={selectedCategory === cat.name ? 'dark' : 'outline-dark'} 
    className="m-1 rounded-pill"
    onClick={() => setSelectedCategory(cat.name)} // Matches 'name' from Django
  >
    {cat.name}
  </Button>
))}
      </div>
      <h1>Products</h1>

      {
        loading?(
         <Loader/>
        ):error? (
          <Message variant='danger'>{error}</Message>
        ):(
          <Row>
            
            {filteredProducts.map((product)=>(
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product}/>
              </Col>


            ))}
          </Row>
        )
      }

    </Container>
  )
}

export default HomeScreen