import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    id: Number,
    fullName: String,
    phone: String,
    email: String,
    hobbies: [String],
    date: Date
});
const Record = mongoose.model('Record', recordSchema);

export default Record;