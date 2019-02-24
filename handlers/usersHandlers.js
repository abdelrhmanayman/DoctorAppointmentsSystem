const bcrypt = require('bcrypt')
const { userModelCreateUser, userModelGetUser, userModelGetDoctorAvailableTimes } = require('../models/user')
const { mongoErrors, serverMessages } = require('../constants/strings')
const { appointmentModelCreateAppointment, appointmentModelCancelAppointment, appointmentModelGetAllAppointments, appointmentModelAcceptRejectAppointment } = require('../models/appointment')

createUser = async (user) => {
    let response = null
    try {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync())
        response = await userModelCreateUser(user)
        return { username: response.name }
    } catch (err) {
        err.code == mongoErrors.duplicated ? response = serverMessages.userExists : response = serverMessages.serverError
        return response
    }
}
login = async (username, password) => {
    let user = await userModelGetUser(username)
    return user ? bcrypt.compareSync(password, user.password) ? user : ({ msg: 'incorrect username or password', status: 401 }) : ({ msg: 'user not found', status: 404 })
}
userHandlerGetDoctorAvailbleSlots = async (doctor) => await userModelGetDoctorAvailableTimes(doctor)
userHandlerRequestAppointment = async (appointment) => {
    let doctorAvailableTime = (await userHandlerGetDoctorAvailbleSlots(appointment.doctor)).availableDays
    let check = doctorAvailableTime.includes(appointment.time)
    if (!check) {
        return false
    } else {
        return await appointmentModelCreateAppointment(appointment)
    }
}
userHandlerGetAllAppointments = async (doctor) => await appointmentModelGetAllAppointments(doctor)
userHandlerCancelAppointment = async (appointment) => await appointmentModelCancelAppointment(appointment)
userHandlerAcceptOrRejectAppointment = async (appointment) => await appointmentModelAcceptRejectAppointment(appointment)

module.exports = {
    createUser, login, userHandlerGetDoctorAvailbleSlots,
    userHandlerRequestAppointment, userHandlerCancelAppointment, userHandlerGetAllAppointments, appointmentModelAcceptRejectAppointment
}