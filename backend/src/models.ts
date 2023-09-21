// models.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true },
    walletAddress: String
});

export const User = mongoose.model('User', userSchema);
