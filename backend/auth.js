'use strict';
const fetch = require('node-fetch')
const tools = require('./token.js')

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

module.exports.handler = async (event, context) => {
    console.log(event)
    console.log(context)
    let token = await tools.get_token(event)
    let id_token = await tools.verify_token(token)    
    let policy
    if (id_token && typeof id_token.data.permissions !== 'undefined') {
        let scopes = id_token.data.permissions.join('|');
        policy = generatePolicy(id_token.data.sub, 'Allow', event.methodArn, scopes);
    }
    else {
        policy = generatePolicy(id_token.data.sub, 'Deny', event.methodArn);
    }

    return policy
}

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource, scopes = null) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    if (scopes !== null) {
        authResponse.context = {"scopes": scopes};
    }

    return authResponse;
}