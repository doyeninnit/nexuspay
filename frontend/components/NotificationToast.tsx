// components/NotificationToast.tsx

type NotificationProps = {
    message: string;
    type?: 'success' | 'error' | 'info';
  }
  
  const NotificationToast: React.FC<NotificationProps> = ({ message, type = 'info' }) => {
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  
    return (
      <div className={`fixed bottom-4 left-4 p-4 rounded ${bgColor} shadow-md`}>
        {message}
      </div>
    );
  }
  
  export default NotificationToast;
  