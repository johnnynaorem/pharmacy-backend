import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL)
    console.log(`Connected to mongoDB ${con.connection.host}`.bgMagenta.black)
  } catch (error) {
    console.log(`Error in MongoDB ${error}`)
  }
}

export default connectDB;