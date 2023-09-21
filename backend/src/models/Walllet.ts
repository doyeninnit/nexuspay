import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    encryptedSecret: { type: String, required: true }
});
const Walllet = mongoose.model('Walllet', walletSchema);

export default Walllet;
