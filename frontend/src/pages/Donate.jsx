import React from 'react';
import { Heart, CreditCard, Gift, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Donate = () => {
    const [customAmount, setCustomAmount] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [donorName, setDonorName] = React.useState('');
    const [donorEmail, setDonorEmail] = React.useState('');
    const [donorContact, setDonorContact] = React.useState('');

    const programs = [
        { id: 'education', title: 'Sponsor a Child Education', desc: 'Provide books, uniform, and tuition for a year.', amount: 12000 },
        { id: 'health', title: 'Medical Camp Support', desc: 'Medicine and equipment for rural village camps.', amount: 5000 },
        { id: 'environment', title: 'Plant 100 Trees', desc: 'Contribution towards green cover initiatives.', amount: 2500 },
    ];

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (amount) => {
        if (!donorName || !donorEmail || !donorContact) {
            alert('Please fill out all your contact details (Name, Email, Phone) before proceeding.');
            return;
        }
        setLoading(true);
        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order
            const orderResponse = await fetch('/api/payment/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, name: donorName, email: donorEmail, contact: donorContact }),
            });
            
            const orderData = await orderResponse.json();
            
            if (!orderData.success) {
                alert('Server error. Please try again.');
                setLoading(false);
                return;
            }

            // 2. Open Razorpay Checkout
            const keyResponse = await fetch('/api/payment/key');
            const keyData = await keyResponse.json();
            
            const options = {
                key: keyData.key,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Samikaran NGO",
                description: "Donation for a Cause",
                image: "/logo.png", // Using the logo from public folder
                order_id: orderData.order.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    const verifyResponse = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }),
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        alert('Payment Successful! Thank you for your donation.');
                    } else {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: donorName,
                    email: donorEmail,
                    contact: donorContact
                },
                notes: {
                    address: "Samikaran Office"
                },
                theme: {
                    color: "#F37254"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-primary text-white py-16 text-center rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-5xl font-bold mb-4">Make a Difference</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Your small contribution can create a massive impact. 100% of your donation goes directly to the cause.
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto border border-gray-100">
            
            <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">1. Your Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" value={donorName} onChange={e => setDonorName(e.target.value)} className="w-full p-4 bg-white rounded-xl font-medium outline-none border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary" />
                    <input type="email" placeholder="Email Address" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} className="w-full p-4 bg-white rounded-xl font-medium outline-none border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary" />
                    <input type="tel" placeholder="Phone Number" value={donorContact} onChange={e => setDonorContact(e.target.value)} className="md:col-span-2 w-full p-4 bg-white rounded-xl font-medium outline-none border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">2. Choose a Cause</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {programs.map(prog => (
                    <div key={prog.id} onClick={() => handlePayment(prog.amount)} className="border-2 border-transparent hover:border-primary bg-gray-50 p-6 rounded-xl cursor-pointer transition-all hover:bg-primary/10 group text-center">
                        <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm text-primary mb-4 group-hover:scale-110 transition-transform">
                            <Gift size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{prog.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{prog.desc}</p>
                        <div className="text-lg font-bold text-primary">₹{prog.amount.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <p className="text-gray-500 mb-6">Or enter a custom amount</p>
                <div className="flex gap-4 justify-center max-w-md mx-auto mb-8">
                    <span className="p-4 bg-gray-100 rounded-l-xl font-bold text-gray-500 text-xl">₹</span>
                    <input 
                        type="number" 
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter Amount" 
                        className="w-full p-4 bg-gray-100 rounded-r-xl font-bold text-xl outline-none focus:ring-2 focus:ring-primary" 
                    />
                </div>
                
                <button 
                    onClick={() => {
                        if (customAmount && customAmount > 0) handlePayment(customAmount);
                        else alert("Please enter a valid amount");
                    }}
                    disabled={loading}
                    className="w-full md:w-auto px-12 py-4 bg-secondary text-gray-900 font-bold text-xl rounded-full shadow-lg hover:brightness-90 hover:shadow-secondary/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : 'Proceed to Pay'} <ArrowRight size={24} />
                </button>
            </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div className="p-6">
                <CheckCircle className="mx-auto text-primary mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2">Tax Benefits</h3>
                <p className="text-gray-600">All donations are tax deductible under Section 80G.</p>
            </div>
            <div className="p-6">
                <Heart className="mx-auto text-primary mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
                <p className="text-gray-600">We use SSL encryption to ensure your data is safe.</p>
            </div>
            <div className="p-6">
                <CreditCard className="mx-auto text-primary mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2">Transparency</h3>
                <p className="text-gray-600">Receive regular updates on how your funds are used.</p>
            </div>
        </div>
      </div>
    </div>
  )
}
export default Donate;
