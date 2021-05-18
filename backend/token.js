module.exports = {
    get_token: async function(event) {
        let whole_auth_token = event.authorizationToken
        console.log('Client token: ' + whole_auth_token)
        console.log('Method ARN: ' + event.methodArn)
        if (whole_auth_token === '') {
            return false;
        }

        let token_parts = whole_auth_token.split(' ')
        let auth_token = token_parts[1]
        let token_method = token_parts[0]

        if (token_method.toLowerCase() !== 'bearer' || auth_token === '') {
            console.log('Failing due to invalid token_method or missing auth_token')
            return false
        }

        return auth_token
    },
    verify_token: async function (token) {
        var jwt = require('jsonwebtoken');
        
        const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
        const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
    
        return new Promise((resolve) => {
            try {
                jwt.verify(
                    token,
                    getKey,
                    {algorithm: "RS256", audience: AUTH0_AUDIENCE, issuer: "https://"+AUTH0_DOMAIN+"/"},
                    (error, data) => {
                        resolve({ data, error: error });
                    }
                );
            } 
            catch (error) {
                console.log(error);
                resolve({ data: null, error: error });
            }
        });
    }
}
async function getKey(header, callback) {
    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

    var jwks = require('jwks-rsa')

    const client = jwks({
        jwksUri: 'https://' + AUTH0_DOMAIN + '/.well-known/jwks.json',
      });

    client.getSigningKey(header.kid, function (err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}
