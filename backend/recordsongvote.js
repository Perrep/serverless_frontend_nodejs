'use strict';
const AWS = require('aws-sdk')
const scope = require('./scope_check.js')

module.exports.handler = async (event) => {
  await scope.check(event, 'write:votes')
  const body = JSON.parse(event.body)
  const songName = body.songName
  const queryUserParams = {
    TableName: process.env.DYNAMODB_TABLE,
    Key : {
        songName : songName
    },
    UpdateExpression :'add votes :inc',
    ExpressionAttributeValues : {
      ':inc':1
    },
    ReturnValues : "UPDATED_NEW"
  }

  let userResult = {}
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    userResult = await dynamodb.update(queryUserParams).promise()
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
      {votes: userResult.Attributes.votes}
    ),
  };
};
