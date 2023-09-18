// components/PrimaryActions.tsx

const PrimaryActions = () => {
    return (
      <div className="grid grid-cols-3 gap-4 mt-8">
        <button className="bg-blue-600 p-4 rounded text-white">Send</button>
        <button className="bg-purple-600 p-4 rounded text-white">Receive</button>
        <button className="bg-teal-600 p-4 rounded text-white">Pay Merchants</button>
      </div>
    );
  }
  
  export default PrimaryActions;
  