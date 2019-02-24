const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    userType: {
        type: String,
        default: 'user',
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const doctorSchema = new mongoose.Schema({
    availableDays: {
        type: [String],
        required: true,
        default: []
    }
})

const userModel = mongoose.model('user', userSchema)
const doctorModel = userModel.discriminator('doctor', doctorSchema)

const userModelCreateUser = (user) => user.userType == 'doctor' ? new doctorModel(user).save() : new userModel(user).save()
const userModelGetUser = (name) => userModel.findOne({ name }).select({ _id: 0 })
const userModelGetUserType = (name) => userModel.findOne({ name }).select({ _id: 0, userType: 1 })
const userModelGetDoctorAvailableTimes = (name) => userModel.findOne({ name }).select({ _id: 0, availableDays: 1 })

module.exports = {
    userModel, userModelCreateUser, userModelGetUser, userModelGetUserType, userModelGetDoctorAvailableTimes
}