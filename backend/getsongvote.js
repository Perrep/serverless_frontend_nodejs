'use strict';
const AWS = require('aws-sdk')

module.exports.handler = async (event) => {
  const queryUserParams = {
    TableName: process.env.DYNAMODB_TABLE,

  }
  let userResult = {}
  let songVotes = []
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    userResult = await dynamodb.scan(queryUserParams).promise()
    
    for (var key in userResult.Items) {
        songVotes.push({songName: userResult.Items[key].songName, songVote: userResult.Items[key].votes})
    }
  } catch(queryError) {
    console.log('There was an error attempting to retrieve the user')
    console.log('queryError', queryError)
    console.log('queryUserParams', queryUserParams)
    return new Error('There was an error attempting to retrieve the user')
  }

  return {
    statusCode: 200,
    headers: {"Access-Control-Allow-Origin": "*"},
   body: JSON.stringify(
      songVotes
    ),
  };
};
