import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

//data
import issues from '../data/jira/issues'

//styles
import './IndexPage.css'

//constants
import { NODE_SERVER_URL } from '../constants/urls'

class IndexPage extends Component {

  state = {
    issues: []
  }

  async componentDidMount() {
    try {
      const res = await axios.get(`${NODE_SERVER_URL}/issues`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      this.setState({ ...this.state, issues: res.data.issues })
    } catch (error) {
      this.setState({ ...this.state, issues: [] })
    }
  }

  render() {

    const { issues } = this.state

    return (
      <div className="index-page container">
        {
          this.props.isLogged ? (
            <div className="issues-container">
              {
                issues.length ? issues.map((issue, i) => (
                  <Link to={`/issue/${issue.key}`} key={`issue_${i}`}>
                    <div className="issue" >
                      <div className="issue-id">{issue.key}</div>
                      <div className="issue-heading">{issue.fields.summary}</div>
                    </div>
                  </Link>
                )) : <div>No Issues/Stories Found</div>
              }
            </div>
          ) : (
            <div>You Should Login First</div>
          )
        }
      </div>
    )
  }
}

export default IndexPage
