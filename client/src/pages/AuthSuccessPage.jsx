import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class AuthSuccessPage extends Component {
  componentDidMount() {
    const { history: { location: { search = '' } } } = this.props
    const searchSplitArr = search.split('accessToken=');
    console.log(`searchSplitArr`, searchSplitArr)
    if (searchSplitArr.length > 1 && searchSplitArr[1]) {
      const redirectUrl = localStorage.getItem('redirectUrl');
      localStorage.removeItem('redirectUrl')
      localStorage.setItem('accessToken', searchSplitArr[1])
      // this.props.setIsLogged(true)
      // this.props.history.push(redirectUrl)
      window.location.href = `/`
    } else {
      this.props.history.push('/error-page')
    }
  }

  render() {
    return (
      <div className="container">
        Logged In Successfully...
        Redirecting to Last Page...
      </div>
    )
  }
}

export default withRouter(AuthSuccessPage)
