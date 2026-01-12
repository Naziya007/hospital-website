import Appointment from "../models/Apointment.js";

export const createAppointment = async (req, res) => {
    try {
        const { name, email, phone, doctorName, specialist, date, time, symptom } = req.body;

        const appointment = await Appointment.create({
            name,
            email,
            phone,
            doctorName,
            specialist,
            date,
            time,
            symptom,
            userId: req.user.id   // 🔥 logged in user
        });

        res.json({ success: true, data: appointment });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.json({ success: true, data: appointments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
