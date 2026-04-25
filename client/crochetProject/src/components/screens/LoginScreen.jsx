import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Form, Card, InputGroup } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import Loader from '../Loader'
import Message from '../Message'
import {validPassword } from './Regex'
import { login } from '../../actions/userAction'




function LoginScreen() {
  const navigate=useNavigate()

  const [email,setEmail]=useState("")
  const [pass1,setPass1]=useState("")
  const [show,changeshow]=useState("fa fa-eye-slash")


  const dispatch=useDispatch()
  const userLogin=useSelector(state=>state.userLogin)
  const {error,loading,userInfo}=userLogin
      //const redirect = '/'
  const location=useLocation();
  // console.log(location)
  const redirect=location.search ? `/${location.search.split('=')[1]}`:'/'
  //console.log(redirect)
  useEffect(()=>{
      if (userInfo){
        navigate(redirect)
      }
  },[userInfo,redirect,navigate])
  const submitHandler=(e)=>{
    e.preventDefault()
    
    dispatch(login(email,pass1))
    

  }
  const showPassword = () => {
    var x = document.getElementById("pass1");
    

    if (x.type === "password" ) {
      x.type = "text";
     
      changeshow('fa fa-eye');
    } else {
      x.type = "password";
      
      changeshow('fa fa-eye-slash');
    }
  };


   
     

  return (

    <>

      <Container fluid className='mt-3'>
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            <Card>
              <Card.Header as="h3" className='text-center bg-black text-light'>
                Login
              </Card.Header>
              <Card.Body>
               {error &&  <Message variant='danger'>{error}</Message>}
               {loading && <Loader/>}
                <Form onSubmit={submitHandler}>
                  
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label><span><i className="fa-solid fa-envelope"></i></span>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Your Email" value={email}
                     onChange={(e)=>setEmail(e.target.value)}
                     required />
                  </Form.Group>

                  <Form.Group className="mb-3" >
                    <Form.Label><span><i className={show}></i></span>Password</Form.Label>
                    <InputGroup className='mb-3'>
                      <InputGroup.Checkbox onClick={showPassword}/>
                      {" "}
                      <Form.Control
                        placeholder='Enter Password'
                        required
                        type='password'
                        id="pass1"
                        
                        value={pass1}
                        onChange={(e)=>setPass1(e.target.value)}
                      />

                    </InputGroup>

                  </Form.Group>
                  
                 
                  <br />
                  <div className="d-grid gap-2">
                    <Button className='btn btn-md btn-success' type='submit'>
                      {" "}
                      Login{" "}
                      </Button>
                  </div>

                </Form>
                <Row className='py-3'>
                  <Col>
                    New User?
                    <Link to="/signup">Signup</Link>
                  </Col>


                </Row>
              </Card.Body>
            </Card>


          </Col>
          <Col md={3}></Col>
        </Row>

      </Container>



    </>










  )
}

export default LoginScreen