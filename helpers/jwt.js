const {expressjwt} = require('express-jwt');
require('dotenv/config');

function authJwt() {
    const secret = process.env.SECRET
    const api = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked
    }).unless({
        path: [
            {
                url: /\/public\/uploads(.*)/,
                methods: ['GET', 'OPTIONS']
            },
            {
                url: /\/api\/v1\/products(.*)/,
                methods: ['GET', 'OPTIONS']
            },
            {
                url: /\/api\/v1\/category(.*)/,
                methods: ['GET', 'OPTIONS']
            },
            api + '/users/login',
            api + '/users/register',
        ]
    });
}
async function isRevoked(req, payload) {
    return payload.isAdmin === false;
}

module.exports = authJwt;