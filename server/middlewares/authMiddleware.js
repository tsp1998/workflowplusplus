const axios = require('axios')
const fs = require('fs')
const path = require('path')

module.exports = async (req, res, next) => {
  try {
    const bearer = req.headers['authorization'] || ''

    if (!bearer) { throw new Error('No authorization token provided...') }

    const accessToken = bearer.split(' ')[1];

    if (!accessToken) { throw new Error('No authorization token provided...') }

    const res = await axios.get(`${process.env.jiraApiUrl}/3/myself`, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })

    req.jiraUser = res.data;

    const data = fs.readFileSync(path.resolve(__dirname, '..', 'tokens', res.data.accountId + '.txt'), 'utf-8')

    if (data !== accessToken) { throw new Error('Token provided not matched...') }

    next();

  } catch (error) {
    next(error);
  }
}