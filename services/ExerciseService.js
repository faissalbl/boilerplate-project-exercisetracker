const Exercise = require('../models/Exercise')

module.exports.getExercises = async function(userId) {
    return (
        await Exercise.find({ user: userId })
            .select([ 'user', 'description', 'duration', 'date' ])
    )
}

module.exports.saveExercise = async function(userId, description, sDuration, sDate) {
    const duration = new Number(sDuration)
    const date = new Date(sDate)

    let exercise = new Exercise({ user: userId, description, duration, date })
    exercise = await exercise.save()
    exercise = await exercise.populate({path: 'user', select: 'username'}).execPopulate()
    return exercise
}