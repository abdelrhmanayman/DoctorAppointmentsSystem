const generalAPIS = ['register', 'login']
const serverMessages = {
    checkCredentials: "Check the missings",
    userExists: 'User exists',
    serverError: 'Internal server error',
    userNotExsists: 'User does not exist',
    userNotLoggedIn: 'Login first',
    userNotAuthorized: 'user not authorized',
    badRequest: "Bad request",
    doctorNotAvailable: "doctor is not available in this time",
    appointmentReserved: "you have already reserved this appointment",
    cancelAppointmentError: "weather doctor or appointment not exist",
    AppointmentCancelledBefore: "Appointment already cancelled",
    appointmentNotFound: "Appointment not exists",
    appointmentOperationDone: "this operation done before on this appointment" 
}
const mongoErrors = {
    duplicated: 11000
}
const roleApis = {
    doctor: ['logout', 'getAllAppointments', 'appointmentAcceptReject'],
    user: ['logout', 'requestAppointment', 'getDoctorAvailableSlots', 'cancelAppointment']
}

module.exports = {
    generalAPIS, serverMessages, mongoErrors, roleApis
}
