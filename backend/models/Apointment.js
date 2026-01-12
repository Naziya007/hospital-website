import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    doctorName: { type: String, required: true },
    specialist: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    symptom: { type: String, required: true },

    //  Logged-in user ID
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    }

}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
