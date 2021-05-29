import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import axios from 'axios'

//data
import issues from '../data/jira/issues'

//styles
import './IssuePage.css'

//constants
import { NODE_SERVER_URL, PYTHON_SERVER_URL } from '../constants/urls'

class IssuePage extends Component {

  state = {
    issueId: '',
    heading: '',
    resolutionComment: '',
    rootCause: '',
    projectPath: '',
    logsPath: '',
    attachmentsPath: '',
    featureBranch: '',
    build: '',
    reporterId: '',
    isLoading: false
  }

  componentDidMount() {
    const issueId = this.props.match.params && this.props.match.params.issueId;

    const issueData = localStorage.getItem('issueData')

    if (issueData) {
      this.setState(JSON.parse(issueData))
    }

    const issue = issues.find(issue => issue.id === issueId)

    if (issue) {
      this.setState({ issueId: issue.id, heading: issue.heading })
    }

    this.setState({ issueId })
    // if (!issueId) {
    //   this.props.history.push('/')
    // }
  }

  handleClick = e => {
    this.setState({ [e.target.id]: e.target.value }, () => {
      localStorage.setItem('issueData', JSON.stringify(this.state))
    });
  }

  start = async () => {
    try {
      const { heading, issueId, featureBranch, projectPath } = this.state;
      const finalHeading = heading.replace(/[^a-zA-Z0-9\s]/g, '').replace(/ /g, '-')
      const commandBatch = [`git flow bugfix start ${issueId + '-' + finalHeading} ${featureBranch}`]
      // console.log(`commandBatch`, { commandBatch, projectPath })
      // console.log(`commandBatch`, JSON.stringify({ commandBatch, projectPath }))
      const res = await axios.post(`${PYTHON_SERVER_URL}/commandBatch`, { commandBatch, projectPath })

      console.log(`res`, res)
      alert('Done')
    } catch (error) {
      
    }
  }

  commit = async () => {
    try {
      const { issueId, heading, resolutionComment, rootCause, projectPath } = this.state

      const commitMessage = `
        ${issueId.toLowerCase()} ${heading.toUpperCase()}
        
        - Resolution Comment
          ${resolutionComment}
        - Root Cause
          ${rootCause}
      `;

      const commandBatch = [`git commit -F msg.txt`]
      const res = await axios.post(`${PYTHON_SERVER_URL}/commandBatch`, {
        commandBatch, projectPath, commitMessage
      })

      console.log(`res`, res)
      alert('Done')
    } catch (error) {
      
    }
  }

  push = async () => {
    try {
      const { heading, issueId, projectPath } = this.state;
      const finalHeading = heading.replace(/[^a-zA-Z0-9\s]/g, '').replace(/ /g, '-')
      const commandBatch = [`git push origin bugfix/${issueId + '-' + finalHeading}`]
      // console.log(`commandBatch`, { commandBatch, projectPath })
      // console.log(`commandBatch`, JSON.stringify({ commandBatch, projectPath }))
      const res = await axios.post(`${PYTHON_SERVER_URL}/commandBatch`, { commandBatch, projectPath })

      console.log(`res`, res)
      alert('Done')
    } catch (error) {
      
    }
  }

  finish = async () => {
    try {
      const { heading, issueId, projectPath } = this.state;
      const finalHeading = heading.replace(/[^a-zA-Z0-9\s]/g, '').replace(/ /g, '-')
      const commandBatch = [`git flow bugfix finish ${issueId + '-' + finalHeading}`, 'git push']
      // console.log(`commandBatch`, { commandBatch, projectPath })
      // console.log(`commandBatch`, JSON.stringify({ commandBatch, projectPath }))
      const res = await axios.post(`${PYTHON_SERVER_URL}/commandBatch`, { commandBatch, projectPath })

      console.log(`res`, res)
      alert('Done')
    } catch (error) {
      
    }
  }

  handleReloadIssue = async () => {
    try {
      const { issueId } = this.state
      const res = await axios.get(`${NODE_SERVER_URL}/issues/${issueId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })


      const issue = res.data.issue;
      let resolutionComment, rootCause;
      try {
        resolutionComment = issue.fields && issue.fields.description && issue.fields.description && issue.fields.description.content[0].content[0].text || ''
      } catch (error) {}

      try {
        rootCause = issue.fields && issue.fields.environment && issue.fields.environment && issue.fields.environment.content[0].content[0].text || ''
      } catch (error) {}
      
      this.setState({
        heading: issue.fields.summary,
        rootCause: rootCause || '', resolutionComment: resolutionComment || '',
        reporterId: issue.fields && issue.fields.reporter && issue.fields.reporter.accountId
      })
    } catch (error) {
      console.log(`error`, error)
    }

  }

  assigneeToQA = async () => {
    this.setState({ isLoading: true })
    try {
      const { issueId, resolutionComment, rootCause, reporterId, build } = this.state;
      let res = await axios.put(`${NODE_SERVER_URL}/issues/${issueId}`, {
        resolutionComment, rootCause
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      console.log(`res`, res)

      res = await axios.put(`${NODE_SERVER_URL}/issues/${issueId}/comment`, {
        comment: `Validated on build ${build} working as expected`
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      console.log(`res`, res)

      res = await axios.put(`${NODE_SERVER_URL}/issues/${issueId}/assignee`, {
        reporterAccountId: reporterId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      console.log(`res`, res)

      res = await axios.post(`${NODE_SERVER_URL}/issues/transitions/${issueId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      console.log(`res`, res)
      alert('Done')
    } catch (error) {
      console.log(`error`, error);
    }
    this.setState({ isLoading: true })
  }

  fields = [
    { id: 'heading', label: 'Heading', textComponent: 'textarea' },
    { label: 'Resolution Comment', id: 'resolutionComment', textComponent: 'textarea' },
    { label: 'Attachments Path(Suite, Images, Videos)', id: 'attachmentsPath', textComponent: 'input' },
    { label: 'Root Cause', id: 'rootCause', textComponent: 'textarea' },
    { label: 'Logs Path', id: 'logsPath', textComponent: 'input' },
    { label: 'Project Path', id: 'projectPath', textComponent: 'input' },
    { label: 'Feature Branch', id: 'featureBranch', textComponent: 'input' },
    { label: 'Build', id: 'build', textComponent: 'input' },
  ]


  render() {

    const { issueId, isLoading } = this.state;

    return (
      <div className="issue-page container">
        {
          issueId ? (
            <div className="issue-container">
              {isLoading && <h2>Please wait...</h2>}
              <div className="issue-id">
                {issueId}
                <button onClick={this.handleReloadIssue}>Reload</button>
              </div>
              {
                this.fields.map((field, i) => (
                  <div className="form-group issue-heading" key={`field_${i}`}>
                    <label htmlFor={field.id}>{field.label}</label>
                    {field.textComponent === 'textarea' ? (
                      <textarea
                        id={field.id}
                        value={this.state[field.id]}
                        onChange={this.handleClick}
                      ></textarea>
                    ) : (
                      <input
                        type="text"
                        id={field.id}
                        value={this.state[field.id]}
                        onChange={this.handleClick}
                      />
                    )}
                  </div>
                ))
              }
              <div className="git-container">
                <h4 className="heading">
                  Git Operations
                </h4>
                <button onClick={this.start}>Start</button>
                <button onClick={this.commit}>Commit</button>
                <button onClick={this.push}>Push</button>
                <button onClick={this.finish}>Finish</button>
              </div>

              <div className="git-container">
                <h4 className="heading">
                  Git Operations
                </h4>
                <button onClick={this.assigneeToQA}>
                  {isLoading ? 'Loading' : 'Assign To QA'}
                </button>
                <button>Assign To Dev</button>
              </div>

              <div className="git-container">
                <h4 className="heading">
                  Git Operations
                </h4>
                <button>Download</button>
                <button>Download & Install</button>
                <button>Run Test Suite</button>
              </div>
            </div>
          ) : (
            <Link to="/">Home</Link>
          )
        }
      </div>
    )
  }
}

export default withRouter(IssuePage)
