import React from 'react'
import {Container} from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import { HashRouter as Router, Routes,Route} from 'react-router-dom'
import HomeScreen from './components/screens/HomeScreen'
import SignupScreen from './components/screens/SignupScreen'
import LoginScreen from './components/screens/LoginScreen'
import CartScreen from './components/screens/CartScreen'
import WishlistScreen from './components/screens/WishlistScreen'
import Product from './components/Product'
import ProductScreen from './components/screens/ProductScreen'
import PlaceOrderScreen from './components/screens/PlaceOrderScreen'
import ShippingScreen from './components/screens/ShippingScreen'
import PaymentScreen from './components/screens/PaymentScreen'
import OrderScreen from './components/screens/OrderScreen'
import MyOrdersScreen from './components/screens/MyOrdersScreen'
import './App.css'




function App() {
  return (
    <>
     <Router>
      <Header />
      <main className='py-3'>
        <Container>
      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='/product/:id' element={<ProductScreen />} />
        <Route path='/signup' element={<SignupScreen />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/cart/:id?' element={<CartScreen />} />
        <Route path='/wishlist' element={<WishlistScreen/>}/>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/myorders' element={<MyOrdersScreen />} />
        

      </Routes>
      </Container>

       </main>
      <Footer />
    </Router>
    </>
  )
}

export default App