import React, { useState } from 'react';

const Messaging: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="bg-blue-600 text-white text-center py-4 shadow-md">
        Wallet-to-Wallet Messaging
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message, idx) => (
          <div key={idx} className="mb-4 p-3 bg-white rounded shadow-md">
            {message}
          </div>
        ))}
      </div>

      <div className="border-t p-4 bg-white shadow-inner flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 rounded border border-gray-300 outline-none"
        />
        <button onClick={handleSendMessage} className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
}

export default Messaging;
