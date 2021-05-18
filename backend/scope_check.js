'use strict';

module.exports.check = async (event, required_scopes = null) => {
        if (required_scopes === null) {
            throw new Error('No expected scopes specified')
        }

        if(event.requestContext.authorizer.scopes === null) {
            throw new Error('No scopes provided')
        }
        
        let provided_scopes = event.requestContext.authorizer.scopes
        provided_scopes = provided_scopes.split('|')
        
        if (required_scopes.isArray) {
            for (let i = 0; i < required_scopes.length; i++) {
                if (provided_scopes.includes(required_scopes[i]) === false) {
                    throw new Error('Scope check failed for: ' + required_scopes)

                }
            }
            console.log('Scope check passed for ' + required_scopes)
        }
        else if (provided_scopes.includes(required_scopes)) {
            console.log('Scope check passed for ' + required_scopes)
        }
        else {
            throw new Error('Scope check failed for: ' + required_scopes)
        }

    }