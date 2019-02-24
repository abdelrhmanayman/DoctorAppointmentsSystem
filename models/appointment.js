const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    },
    cancelled: {
        type: Boolean,
        default: false
    }
})

const AppointmentModel = mongoose.model('appointments', appointmentSchema)

const appointmentModelCreateAppointment = async (appointment) => {
    let check = await AppointmentModel.findOne({ patient: appointment.patient, doctor: appointment.doctor, cancelled: false })
    return !check ? new AppointmentModel(appointment).save() : ({ status: 400 })
}
const appointmentModelCancelAppointment = ({ doctor, patient }) => AppointmentModel.updateOne({ doctor, patient }, { $set: { cancelled: true } })
const appointmentModelGetAllAppointments = (doctor) => AppointmentModel.find({ doctor, cancelled: false }).select({ _id: 0 })
const appointmentModelAcceptRejectAppointment = ({ doctor, patient, operation }) => AppointmentModel.updateOne({ doctor, patient }, { $set: { accepted: operation } })

module.exports = {
    AppointmentModel, appointmentModelCreateAppointment,
    appointmentModelCancelAppointment, appointmentModelGetAllAppointments, appointmentModelAcceptRejectAppointment
}