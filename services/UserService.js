const User = require('../models/User')

module.exports.getUsers = async function() {
    return await User.find().select([ '_id', 'username' ])
}

module.exports.saveUser = async function(pUsername) {
    const user = new User({ username: pUsername })
    const { _id, username } = await user.save()
    return { _id, username }
}