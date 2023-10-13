// // components/PrimaryActions.tsx

// const PrimaryActions = () => {
//     return (
//       <div className="grid grid-cols-3 gap-4 mt-8">
//         <button className="bg-blue-600 p-4 rounded text-white">Send</button>
//         <button className="bg-purple-600 p-4 rounded text-white">Receive</button>
//         <button className="bg-teal-600 p-4 rounded text-white">Pay Merchants</button>
//       </div>
//     );
//   }
  
//   export default PrimaryActions;
  
// components/PrimaryActions.tsx
// import Link from 'next/link';

// const PrimaryActions = () => {
//     return (
//       <div className="grid grid-cols-3 gap-4 mt-8">
//         <Link href="/send">
//           <button className="bg-blue-600 p-4 rounded text-white">
//             Send
//           </button>
//         </Link>
//         <button className="bg-purple-600 p-4 rounded text-white">Receive</button>
//         <Link href="/payMerchants">
//           <button className="bg-teal-600 p-4 rounded text-white">
//             Pay Merchants
//           </button>
//         </Link>
//       </div>
//     );
// }

// export default PrimaryActions;

// components/PrimaryActions.tsx
import Link from 'next/link';

const PrimaryActions = () => {
    return (
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-blue-600 p-4 rounded">
          <Link href="/send">
            <span className="text-white block text-center">
              Send
            </span>
          </Link>
        </div>
        <div className="bg-purple-600 p-4 rounded">
  <Link href="/receive">
    <span className="text-white block text-center">
      Receive
    </span>
  </Link>
</div>        <div className="bg-teal-600 p-4 rounded">
          <Link href="/payMerchants">
            <span className="text-white block text-center">
              Pay
            </span>
          </Link>
        </div>
      </div>
    );
}

export default PrimaryActions;


