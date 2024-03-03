// Import AfricasTalking module. If TypeScript types are not available, you might still need to use require or @types/africastalking if the package exists.
import AfricasTalking from 'africastalking';

// Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: '72304a965e635452ae1160a269365c30bd1ea72e6d39fba3aebd76cfa09af4a7',
  username: 'sandbox'
});

// Define the sendSMS function
const sendSMS = async (): Promise<void> => {
  try {
    const result = await africastalking.SMS.send({
      to: '+254796448347',
      message: 'Hey AT Ninja! Wassup...',
      from: 'NEXUSPAY'
    });
    console.log(result);
  } catch (ex) {
    console.error(ex);
  }
};

// Export the sendSMS function
export default sendSMS;
