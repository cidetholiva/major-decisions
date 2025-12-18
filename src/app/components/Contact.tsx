//assignment requirements are commented! (plus other comments in general)

import { Link } from "react-router-dom";
import Layout from "./Layout";
import PageHero from "./PageHero";

export default function Contact() {

  // this runs when the form is successfully submitted
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevents page refresh
    alert("Message sent! Thank you for reaching out");
    e.currentTarget.reset(); // clears the form

  }

  return (

    <Layout>
      <PageHero 
        title="Contact Us"
        imageSrc="https://umd-today.transforms.svdcdn.com/production/images/today/Homecoming_11012025_SC_1881_1920x1080-1.jpg?w=1920&h=1920&q=80&fm=webp&fit=max&dm=1765487526&s=0d0821ddde4aa63c715c4c352055e5b4"
      />

      {/* intrp Text */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="max-w-3xl space-y-6">
          <p className="text-lg text-black leading-relaxed">
            We'd love to hear from you. Whether you have questions about using Major Decisions, feedback on how we can improve, or suggestions for new features, we're here to listen!
          </p>
          <p className="text-lg text-black leading-relaxed">
            Major Decisions is a student-built project designed to make academic planning more accessible and intuitive. Your input helps us better serve the student community.
          </p>
        </div>
      </div>

      {/* contact form */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl text-yellow-500 mb-8 tracking-tight">
              Send Us A Message
            </h2>
            <form onSubmit={handleSubmit}className="bg-white rounded-lg p-8 border border-gray-200 space-y-6">

              <div>
                <label htmlFor="name" className="block text-lg text-black mb-2"> Name </label>
                <input type="text" id="name" placeholder="Your full name" required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-lg text-black mb-2"> Email</label>
                <input type="email" id="email" placeholder="your.email@example.com" required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"/>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-lg text-black mb-2"> Message</label>
                <textarea id="message" rows={6} placeholder="Tell us what's on your mind..." required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"/>
              </div>
              
              <button type="submit" className="w-full bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-colors">Send Message</button>

            </form>
          </div>
        </div>
      </div>

      {/* more info? */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="max-w-3xl space-y-6">
          <h2 className="text-4xl text-yellow-500 mb-8 tracking-tight">
            Want To Know More? 
          </h2>
          <p className="text-lg text-black leading-relaxed"> You can visit the UMD schedule of classes at{" "} 
            <a href="https://app.testudo.umd.edu/soc/" target="_blank" rel="noopener noreferrer" className="text-red-600 underline hover:text-red-700" > https://app.testudo.umd.edu/soc/ </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}