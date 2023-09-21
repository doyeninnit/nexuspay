import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { Wallet, Client } from 'xrpl';
import User from './models/User';
import Walllet  from './models/Walllet';
import crypto from 'crypto';
import Business from './models/Business'; 

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb+srv://agatenashons:Nashtech9021@xrpl.vo0wfha.mongodb.net/?retryWrites=true&w=majority";

const ENCRYPTION_KEY = "12345678901234567890123456789012";

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use(bodyParser.json());


app.post('/register', async (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  if (!phoneNumber) {
      return res.status(400).send({ message: "Phone number is required!" });
  }

  const api = new Client("wss://s.altnet.rippletest.net:51233");
  await api.connect();

  // Create a funded testnet wallet
  const fundedWallet = await api.fundWallet();
  const encryptedSecret = encrypt(fundedWallet.wallet.seed as string);



  const user = new User({
    phoneNumber: phoneNumber,
    walletAddress: fundedWallet.wallet.address
});

const wallet = new Walllet({
  phoneNumber: phoneNumber,
  encryptedSecret: encryptedSecret
});



  try {
    await user.save();
    await wallet.save();
    res.send({ message: "Registered successfully!", walletAddress: fundedWallet.wallet.address, amount: fundedWallet.balance});
} catch (error) {
    handleDbError(res, error);
}
  
  // Close connection after done
  api.disconnect();
});


app.post('/sendXRP', async (req, res) => {
  const senderPhoneNumber = req.body.senderPhoneNumber;
  const receiverPhoneNumber = req.body.receiverPhoneNumber;
  const amount = req.body.amount;  // In drops, 1 XRP = 1,000,000 drops

  // Fetch the sender's wallet details
  const senderWalletDetails = await Walllet.findOne({ phoneNumber: senderPhoneNumber });
  if (!senderWalletDetails) {
      return res.status(400).send({ message: "Sender not found!" });
  }

  // Fetch the receiver's address from the User model
  const receiver = await User.findOne({ phoneNumber: receiverPhoneNumber });
  if (!receiver) {
      return res.status(400).send({ message: "Receiver not found!" });
  }

  const decryptedSecret = decrypt(senderWalletDetails.encryptedSecret);
  const senderWallet = Wallet.fromSeed(decryptedSecret);

  // Send XRP using XRPL library
  try {
      const api = new Client("wss://s.altnet.rippletest.net:51233");
      await api.connect();

      const tx = await api.autofill({
          "TransactionType": "Payment",
          "Account": senderWallet.address,
          "Amount": amount,
          "Destination": receiver.walletAddress  // Fetching destination from the receiver's User record
      });

      const signed = senderWallet.sign(tx);
      const transaction = await api.submitAndWait(signed.tx_blob);

      api.disconnect();
      res.send({ message: "Transaction successful!", transaction: transaction });
  } catch (error) {
      console.error("Error sending XRP:", error);
      res.status(500).send({ message: "An error occurred while sending XRP." });
  }
});



app.post('/registerBusiness', async (req, res) => {
    const ownerPhoneNumber = req.body.ownerPhoneNumber;
    const businessName = req.body.businessName;

    if (!ownerPhoneNumber || !businessName) {
        return res.status(400).send({ message: "Owner phone number and business name are required!" });
    }

    // Check if the user exists and has a normal account
    const user = await User.findOne({ phoneNumber: ownerPhoneNumber });
    if (!user) {
        return res.status(400).send({ message: "User not found!" });
    }

    // Check if the business name is already registered
    const existingBusiness = await Business.findOne({ businessName: businessName });
    if (existingBusiness) {
        return res.status(400).send({ message: "Business name already registered!" });
    }

    // Generate a 5 digit till number
    const tillNumber = Math.floor(10000 + Math.random() * 90000);

    const business = new Business({
        ownerPhoneNumber: ownerPhoneNumber,
        businessName: businessName,
        tillNumber: tillNumber,
        walletAddress: user.walletAddress
    });

    try {
        await business.save();
        res.send({ message: "Business registered successfully!", tillNumber: tillNumber });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).send({ message: "An error occurred while registering the business." });
    }
});



app.post('/pay', async (req, res) => {
    const tillNumber = req.body.tillNumber;
    const amount = req.body.amount; // In drops, 1 XRP = 1,000,000 drops
    const senderPhoneNumber = req.body.senderPhoneNumber; // User's phone number

    // Input validation
    if (!tillNumber || !amount || !senderPhoneNumber) {
        return res.status(400).send({ message: "Till number, amount, and sender phone number are required!" });
    }

    // Retrieve the business using the provided till number
    const business = await Business.findOne({ tillNumber: tillNumber });
    if (!business) {
        return res.status(404).send({ message: "Business not found!" });
    }

    // Present the business name to the user for confirmation
    // (In a real-world scenario, this step would typically involve a separate interaction, but here we're simplifying it for demonstration purposes.)
    if (!req.body.confirm) { // Check if 'confirm' field is set in the request
        return res.status(200).send({
            message: "Please confirm the business name.",
            businessName: business.businessName
        });
    }

    // Retrieve sender's details
    const sender = await Walllet.findOne({ phoneNumber: senderPhoneNumber });
    if (!sender) {
        return res.status(404).send({ message: "Sender not found!" });
    }

    const decryptedSecret = decrypt(sender.encryptedSecret);
    const senderWallet = Wallet.fromSeed(decryptedSecret);

    // Send XRP using XRPL library
    try {
        const api = new Client("wss://s.altnet.rippletest.net:51233");
        await api.connect();

        const tx = await api.autofill({
            "TransactionType": "Payment",
            "Account": senderWallet.address,
            "Amount": amount,
            "Destination": business.walletAddress
        });

        const signed = senderWallet.sign(tx);
        const transaction = await api.submitAndWait(signed.tx_blob);

        api.disconnect();
        res.send({ message: "Transaction successful!", transaction: transaction });
    } catch (error) {
        console.error("Error sending XRP:", error);
        res.status(500).send({ message: "An error occurred while sending XRP." });
    }
});


// Other routes...

// ... (previous code)

function encrypt(text: string): string {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift()!, 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function handleDbError(res: any, error: any) {
  console.error("DB Error:", error);
  if (error.code === 11000) {
      res.status(409).send({ message: "Phone number already registered!" });
  } else {
      res.status(500).send({ message: "An error occurred while registering." });
  }
}

// ... (rest of the code)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
