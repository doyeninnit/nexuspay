import { Request, Response } from 'express';
import AfricasTalking from 'africastalking';

// Setup your environment variables correctly
const africastalking = AfricasTalking({
    apiKey: '72304a965e635452ae1160a269365c30bd1ea72e6d39fba3aebd76cfa09af4a7',
    username: 'sandbox'
  });

// Temporary store for OTPs
const otpStore: Record<string, string> = {};

// Helper function to generate OTP
const generateOTP = (): string => {
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

// Controller to send OTP
export const sendOTP = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({ message: "Phone number is required!" });
  }

  const otp = generateOTP();
  // Store OTP with phoneNumber as key
  otpStore[phoneNumber] = otp;

  try {
    const result = await africastalking.SMS.send({
      to: phoneNumber,
      message: `Your verification code is: ${otp}`,
      from: 'NEXUSPAY'
    });
    console.log(result);
    return res.send({ message: "OTP sent successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Failed to send OTP." });
  }
};

// Controller to verify OTP
export const verifyOTP = (req: Request, res: Response) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).send({ message: "Phone number and OTP are required!" });
  }

  if (otpStore[phoneNumber] && otpStore[phoneNumber] === otp) {
    // OTP is correct, proceed with the logic after verification
    // For security, clear the OTP after verification
    delete otpStore[phoneNumber];
    return res.send({ message: "OTP verified successfully." });
  } else {
    return res.status(400).send({ message: "Invalid OTP." });
  }
};

// Remember to add routes for these controllers in your Express app
