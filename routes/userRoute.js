const router = require('express').Router()
const { checkCredentials, serverMessages } = require('../constants/strings')
const { createUser, userHandlerGetDoctorAvailbleSlots, userHandlerRequestAppointment,
    userHandlerCancelAppointment, userHandlerGetAllAppointments, appointmentModelAcceptRejectAppointment } = require('../handlers/usersHandlers')
const passport = require('passport')


router.post('/register', async (req, res) => {
    try {
        let response = await createUser(req.body)
        if (response.username) {
            res.status(200).json(response)
        } else {
            res.status(400).end(response)
        }
    } catch (err) {
        res.status(500).end(serverMessages.serverError)
    }
})
router.post('/login', (req, res) => {
    try {
        passport.authenticate('local', (err, user, info) => {
            if (!err) {
                if (user.name) {
                    req.login(user, err => {
                        user.password = undefined
                        !err ? res.status(200).json(user) : res.sendStatus(500)
                    })
                } else {
                    res.status(user.status).end(user.msg)
                }
            } else {
                res.status(500).end(serverMessages.serverError)
            }
        })(req, res)
    } catch (err) {
        res.status(500).end(serverMessages.serverError)
    }
})

router.post('/logout', (req, res) => {
    try {
        res.clearCookie('connect.sid')
        req.logout()
        req.session.destroy()
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.post('/requestAppointment', async (req, res) => {
    try {
        let appointment = req.body
        appointment.patient = req.user
        let response = await userHandlerRequestAppointment(appointment)
        return response === false ? res.status(400).end(serverMessages.doctorNotAvailable) : response.status ? res.status(response.status).end(serverMessages.appointmentReserved) : res.status(200).json(response)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.post('/getDoctorAvailableSlots', async (req, res) => {
    try {
        let response = await userHandlerGetDoctorAvailbleSlots(req.body.doctor)
        response ? res.status(200).json(response) : res.status(400).end(serverMessages.badRequest)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.post('/cancelAppointment', async (req, res) => {
    try {
        let appointment = req.body
        appointment.patient = req.user
        let { nModified, n } = await userHandlerCancelAppointment(appointment)
        nModified == 1 ? res.sendStatus(200) : n == 0 ? res.status(404).end(serverMessages.cancelAppointmentError) : n == 1 ? res.status(400).end(serverMessages.AppointmentCancelledBefore) : res.sendStatus(500)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.post('/getAllAppointments', async (req, res) => {
    try {
        let response = await userHandlerGetAllAppointments(req.user)
        response ? res.status(200).json(response) : res.sendStatus(500)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.post('/appointmentAcceptReject', async (req, res) => {
    try {
        if (!req.body.operation || !req.body.patient) throw new err
        let appointment = req.body
        appointment.doctor = req.user
        let { nModified, n } = await appointmentModelAcceptRejectAppointment(appointment)
        nModified == 1 ? res.sendStatus(200) : n == 0 ? res.status(404).end(serverMessages.appointmentNotFound) : n == 1 ? res.status(400).end(serverMessages.appointmentOperationDone) : res.sendStatus(500)
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = router