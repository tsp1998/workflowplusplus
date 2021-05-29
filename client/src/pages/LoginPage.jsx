import React, { Component } from 'react'
import axios from 'axios'

//constants
import { NODE_SERVER_URL } from '../constants/urls'

class IndexPage extends Component {

  async componentDidMount() {
    window.location.href = `${NODE_SERVER_URL}/auth/atlassian`
  }


  render() {
    return (
      <div className="login-page container">
        Login Page
      </div>
    )
  }
}

export default IndexPage
