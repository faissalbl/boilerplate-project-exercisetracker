const Exercise = require('../models/Exercise')

module.exports.getExercises = async function(userId, from, to, limit) {
    const fromFilter = {}
    const toFilter = {}
    if (from) fromFilter.$gte = from
    if (to) toFilter.$lte = to

    let dateFilter = {}
    if (from || to) {
        dateFilter = {
            date: {
                ...fromFilter,
                ...toFilter,
            }
        }
    }

    const query = Exercise.find({ 
        user: userId,
        ...dateFilter
    })
    .select([ 'user', 'description', 'duration', 'date' ])

    if (limit) query.limit(limit)

    return await query
}

module.exports.saveExercise = async function(userId, description, sDuration, sDate) {
    const duration = new Number(sDuration)
    const date = new Date(sDate)

    let exercise = new Exercise({ user: userId, description, duration, date })
    exercise = await exercise.save()
    exercise = await exercise.populate({path: 'user', select: 'username'}).execPopulate()
    return exercise
}