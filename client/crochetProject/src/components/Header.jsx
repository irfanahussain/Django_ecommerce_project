import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container } from "react-bootstrap"
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userAction'



function Header() {
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  const dispatch = useDispatch()
  const logoutHandler = () => {
    dispatch(logout())
  }
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/?search=${keyword}`)
    } else {
      navigate('/')
    }
  }



  return (
    <>


      <Navbar  bg="dark" variant='dark' data-bs-theme="dark" expand='lg' collapseOnSelect>

        <Container>

          <LinkContainer to="/">
  <Navbar.Brand className="fw-bold fs-3" style={{ color: '#6685a3', letterSpacing: '1px', marginLeft: '0', paddingLeft: '0' }}>
    Yarn<span style={{ color: '#d4a373' }}>Nest</span>
  </Navbar.Brand>
</LinkContainer>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor02">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <LinkContainer to="/">
                  <Nav.Link className="navbar-brand" >Home<i className="fa-solid fa-house"></i></Nav.Link>
                </LinkContainer>


              </li>
              <li className="nav-item">
                <LinkContainer to="/cart">
                  <Nav.Link className="nav-link" >Cart<i className="fa-solid fa-cart-shopping"></i></Nav.Link>
                </LinkContainer>
              </li>

              <li className="nav-item">
                <LinkContainer to="/wishlist">
                  <Nav.Link className="nav-link">
                    <i className="fa-regular fa-heart"></i> Wishlist
                  </Nav.Link>
                </LinkContainer>
              </li>
              {userInfo ? (
                <li className="nav-item dropdown">
                  <LinkContainer to="/signup"><Nav.Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    Welcome{userInfo.name}</Nav.Link>
                  </LinkContainer>
                  <div className='dropdown-menu'>
                    <LinkContainer to="/myorders">
        <Nav.Link className="dropdown-item">My Orders</Nav.Link>
      </LinkContainer>

                    <Nav.Link className="dropdown-item" onClick={logoutHandler}>Logout</Nav.Link>
                  </div>
                </li>
              ) : (
                <li className='nav-item dropdown'>
                  <LinkContainer to="/signup">
                    <Nav.Link className='nav-link dropdown-toggle'
                      data-bs-toggle="dropdown"
                      role='button'
                      aria-haspopup='true'
                      aria-expanded='false'>
                      New User?
                    </Nav.Link>
                  </LinkContainer>
                  <div className='dropdown-menu'>
                    <LinkContainer to="/login">
                      <Nav.Link className='dropdown-item' href='#'>
                        Login
                      </Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/signup">
                      <Nav.Link className='dropdown-item' href='#'>
                        Signup
                      </Nav.Link>
                    </LinkContainer>
                  </div>
                </li>
              )}
            </ul>


            <form onSubmit={submitHandler} className="d-flex">
              <input className="form-control me-sm-2" type="search" placeholder="Search" onChange={(e) => setKeyword(e.target.value)} />
              <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>

          </div>
        </Container>

      </Navbar>


    </>
  )
}

export default Header