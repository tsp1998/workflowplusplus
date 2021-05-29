import React from 'react'
import { Link, withRouter } from 'react-router-dom'

//styles
import './Header.css'

const Header = (props) => {

  const handleLoginClick = () => {
    const { history: { location: { pathname, search } } } = props;
    localStorage.setItem('redirectUrl', pathname + search)
    props.history.push('/login')
  }
  
  const handleLogoutClick = () => {
    localStorage.removeItem('accessToken')
    props.setIsLogged(false);
    props.history.push('/')
  }

  return (
    <div className="header">
      <div className="brand">
        <Link to="/">WorkFlow++</Link>
      </div>
      <div className="links-container">
        {
          !props.isLogged ?
            <Link to="#" onClick={handleLoginClick}>Log In</Link> :
            <Link to="#" onClick={handleLogoutClick}>Log Out</Link>
        }
      </div>
    </div>
  )
}

export default withRouter(Header)
