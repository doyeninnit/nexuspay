// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//     phoneNumber: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     walletAddress: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     encryptedSecret: {
//         type: String,
//         required: true
//     }
// });

// const User = mongoose.model('User', userSchema);
// export default User;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// const walletSchema = new mongoose.Schema({
//     phoneNumber: { type: String, required: true, unique: true },
//     encryptedSecret: { type: String, required: true }
// });
// const Walllet = mongoose.model('Wallet', walletSchema);

export default User;

