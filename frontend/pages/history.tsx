import TransactionsHistory from "@/components/TransactionsHistory";


const sampleData = [
    {
        txnId: "1F338716A3C4FAE680365D772E50D08A8806B04E63978BD2AD80E1EF513716FE",
        type: "Payment",
        source: "rDXuJEy2dNi6mMmsq85YAffyhyKPaLwyEW",
        destination: "rBu2Qnwv4od1KcyS3YvY44cuhhqAXfDPjM",
        amount: "10000000",
        fee: "12",
        date: "749029031",
        status: "tesSUCCESS"
    }
    // ... other transactions
];
const Home: React.FC = () => {
    return ( 
        // <>
        //     <TransactionsHistory transactions={sampleData} />
        // </>

        <div className="container">
        <TransactionsHistory />
    </div>
    );
}

export default Home;