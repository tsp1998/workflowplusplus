const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get('/issues', async (req, res, next) => {
  try {
    const resp = await axios.get(`${process.env.jiraApiUrl}/3/search?jql=assignee=${req.jiraUser.accountId}`, {
      headers: {
        Authorization: req.headers['authorization']
      }
    });
    res.json({
      status: 'success',
      issues: resp.data.issues
    })
  } catch (error) {
    next(error)
  }
})

router.get('/issues/:issueKey', async (req, res, next) => {
  try {
    const { issueKey } = req.params;
    const resp = await axios.get(`${process.env.jiraApiUrl}/3/issue/${issueKey}`, {
      headers: {
        Authorization: req.headers['authorization']
      }
    });
    res.json({
      status: 'success',
      issue: resp.data
    })
  } catch (error) {
    next(error)
  }
})

router.put('/issues/:issueKey', async (req, res, next) => {
  try {
    console.log(req.body)
    const { issueKey } = req.params;
    const { resolutionComment, rootCause } = req.body
    const resp = await axios.put(`${process.env.jiraApiUrl}/3/issue/${issueKey}`, {
      "fields": {
        // "reporter": {
        //   "id": "60b019ed9ef86a0068bb599e"
        // },
        "description": {
          "type": "doc",
          "version": 1,
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": resolutionComment,
                  "type": "text"
                }
              ]
            }
          ]
        },
        "environment": {
          "type": "doc",
          "version": 1,
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": rootCause,
                  "type": "text"
                }
              ]
            }
          ]
        }
      }
    }, {
      headers: {
        Authorization: req.headers['authorization']
      }
    });
    res.json({
      status: 'success',
    })
  } catch (error) {
    next(error)
  }
})

router.put('/issues/:issueKey/comment', async (req, res, next) => {
  try {
    const { issueKey } = req.params;
    const resp = await axios.post(`${process.env.jiraApiUrl}/3/issue/${issueKey}/comment`, {
      "body": {
        "type": "doc",
        "version": 1,
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "text": req.body.comment,
                "type": "text"
              }
            ]
          }
        ]
      }
    }, {
      headers: {
        Authorization: req.headers['authorization']
      }
    });
    res.json({
      status: 'success',
    })
  } catch (error) {
    next(error)
  }
})

router.put('/issues/:issueKey/assignee', async (req, res, next) => {
  try {
    const { issueKey } = req.params;
    const { reporterAccountId } = req.body;
    const resp = await axios.put(`${process.env.jiraApiUrl}/3/issue/${issueKey}/assignee`, { "accountId": reporterAccountId }, {
      headers: {
        Authorization: req.headers['authorization']
      }
    });
    res.json({
      status: 'success',
    })
  } catch (error) {
    next(error)
  }
})

router.post('/issues/transitions/:issueKey', async (req, res, next) => {
  try {
    const { issueKey } = req.params;
    console.log(`${process.env.jiraApiUrl}/3/issue/${issueKey}/transitions`)
    const resp = await axios.post(`${process.env.jiraApiUrl}/3/issue/${issueKey}/transitions`, {
      "transition": {
        "id": "41"
      }
    }, {
      headers: {
        Authorization: req.headers['authorization']
      }
    });
    res.json({
      status: 'success',
    })
  } catch (error) {
    next(error)
  }
})


module.exports = router;