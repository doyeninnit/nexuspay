import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    ownerPhoneNumber: { type: String, required: true, unique: true, ref: 'User' },
    businessName: { type: String, required: true, unique: true },
    tillNumber: { type: Number, required: true, unique: true },
    walletAddress: { type: String, required: true }
});

const Business = mongoose.model('Business', businessSchema);

export default Business;
