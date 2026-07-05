import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Input } from '@/components/base/input/input';
import { TextArea } from '@/components/base/textarea/textarea';
import { Button } from '@/components/base/buttons/button';
import { Select } from '@/components/base/select/select';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    source: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: `${formData.countryCode} ${formData.phone}`
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will contact you shortly.' });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          countryCode: '+91',
          phone: '',
          source: '',
          message: ''
        });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/20 rounded-full text-primary font-semibold mb-4">Contact Us</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our programs or want to volunteer? We'd love to hear from you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
           {/* Contact Info */}
           <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl h-fit">
              <h3 className="text-2xl font-bold mb-8 text-gray-900 border-b pb-4">Contact Information</h3>
              <div className="space-y-8">
                 <div className="flex items-start gap-4 group">
                    <div className="p-4 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        <MapPin size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Our Office</h4>
                        <p className="text-gray-600 leading-relaxed">123 NGO Street, Social Welfare Area,<br/>New Delhi, India - 110001</p>
                    </div>
                 </div>
                 
                 <div className="flex items-start gap-4 group">
                    <div className="p-4 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        <Phone size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Phone</h4>
                        <p className="text-gray-600">+91 98765 43210</p>
                        <p className="text-gray-400 text-sm">Mon-Fri 9am to 6pm</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4 group">
                    <div className="p-4 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        <Mail size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Email</h4>
                        <p className="text-gray-600">contact@samikaran.org</p>
                        <p className="text-gray-600">support@samikaran.org</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Form */}
           <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Send us a Message</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                 {status.message && (
                    <div className={`p-4 rounded-xl ${status.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-red-100 text-red-700'}`}>
                        {status.message}
                    </div>
                 )}
                 <div className="grid md:grid-cols-2 gap-6">
                    <Input 
                        label="First Name"
                        name="firstName" 
                        value={formData.firstName}
                        onChange={(val) => setFormData({ ...formData, firstName: val })}
                        placeholder="John" 
                        isRequired
                    />
                    <Input 
                        label="Last Name"
                        name="lastName" 
                        value={formData.lastName}
                        onChange={(val) => setFormData({ ...formData, lastName: val })}
                        placeholder="Doe" 
                        isRequired
                    />
                 </div>
                 
                 <Input 
                     label="Email Address"
                     name="email" 
                     type="email"
                     value={formData.email}
                     onChange={(val) => setFormData({ ...formData, email: val })}
                     placeholder="john@example.com" 
                     isRequired
                 />

                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Mobile Number <span className="text-error">*</span></label>
                    <div className="flex gap-2">
                        <Select 
                            aria-label="Country Code"
                            selectedKey={formData.countryCode}
                            onSelectionChange={(key) => setFormData({ ...formData, countryCode: key })}
                            className="w-[120px]"
                        >
                            <Select.Item id="+91">🇮🇳 +91</Select.Item>
                            <Select.Item id="+1">🇺🇸 +1</Select.Item>
                            <Select.Item id="+44">🇬🇧 +44</Select.Item>
                            <Select.Item id="+977">🇳🇵 +977</Select.Item>
                            <Select.Item id="+61">🇦🇺 +61</Select.Item>
                            <Select.Item id="+81">🇯🇵 +81</Select.Item>
                            <Select.Item id="+49">🇩🇪 +49</Select.Item>
                        </Select>
                        <Input 
                            aria-label="Phone Number"
                            name="phone" 
                            type="tel"
                            value={formData.phone}
                            onChange={(val) => setFormData({ ...formData, phone: val })}
                            placeholder="Enter mobile number" 
                            isRequired
                            className="flex-1"
                        />
                    </div>
                 </div>

                 <Select 
                     label="Where did you hear about us?"
                     selectedKey={formData.source}
                     onSelectionChange={(key) => setFormData({ ...formData, source: key })}
                 >
                     <Select.Item id="Social Media">Social Media</Select.Item>
                     <Select.Item id="Friend/Family">Friend/Family</Select.Item>
                     <Select.Item id="Search Engine">Search Engine</Select.Item>
                     <Select.Item id="Advertisement">Advertisement</Select.Item>
                     <Select.Item id="Other">Other</Select.Item>
                 </Select>

                 <TextArea 
                     label="Message"
                     name="message" 
                     value={formData.message}
                     onChange={(val) => setFormData({ ...formData, message: val })}
                     placeholder="How can we help?" 
                     rows={5} 
                     isRequired
                 />

                 <Button 
                    type="submit"
                    isDisabled={loading}
                    size="lg"
                    className="w-full justify-center text-lg py-6 bg-primary text-white hover:bg-primary/90 shadow-md"
                 >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                        {loading ? 'Sending...' : 'Send Message'} 
                        <Send size={20} className="shrink-0" />
                    </span>
                 </Button>
              </form>
           </div>
        </div>
      </div>
    </div>
  )
}
export default Contact;
