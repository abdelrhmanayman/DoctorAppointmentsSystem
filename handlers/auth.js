const { generalAPIS, roleApis, serverMessages } = require('../constants/strings')
const { userModelGetUserType } = require('../models/user')

const checkAuthentication = async (req, res, next) => {
    let url = req.url.split('/').pop()
    if (generalAPIS.includes(url))
        next()
    else {
        let check = req.isAuthenticated()
        if (!check) {
            res.status(401).end(serverMessages.userNotLoggedIn)
        } else {
            let isAuthorized = await checkAuthorization(req.user, url)
            isAuthorized ? next() : res.status(401).end(serverMessages.userNotAuthorized)
        }
    }
}

const checkAuthorization = async (user, api) => {
    try {
        let userType = (await userModelGetUserType(user)).userType
        return roleApis[userType].includes(api)
    } catch (err) {
        return null
    }
}

module.exports = {
    checkAuthentication
}