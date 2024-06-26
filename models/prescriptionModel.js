import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.ObjectId,
    ref: 'users'
  },
  image: {
    data: Buffer,
    contentType: String
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ["Pending", "Approved", "Cancel"]
  }
}, {timestamps: true})

export default mongoose.model('prescriptions', prescriptionSchema)