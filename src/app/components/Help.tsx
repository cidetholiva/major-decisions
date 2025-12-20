//assignment requirements are commented! (plus other comments in general)
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Layout from './Layout';
import PageHero from './PageHero';

export default function Help() {
  const [openFaq, setOpenFaq] = useState(0);

  //how to steps
  const steps = [
    { number: 1, title: 'Analyze real job postings', description: 'Using an API (OpenWebNinja), we collect and analyze job postings from major employers to understand what skills are in demand.'},

    { number: 2, title: 'Extract required skills', description: 'We then identify the technical and soft skills that employers are actively seeking for each career path.'},

    { number: 3, title: 'Match skills to UMD courses', description: 'We connect those skills to specific courses offered at the University of Maryland across all departments, using an API (umd.io).' },

    { number: 4, title: 'Recommend relevant majors', description: 'Based on the course matches, we suggest majors that best prepare you for your desired career outcomes.' }
  ];

  //FAQs
  const faqs = [
    { question: "Why don't I see a perfect match?", answer: "Job markets and academic programs don't always align perfectly. Many careers can be reached through multiple majors, and many majors lead to a wide range of career paths. We are continuing to improve our matching logic and plan to refine results in future updates!"},

    { question: "Is this an official advising tool?", answer: "No. Major Decisions is a student-built resource designed to supplement—not replace—academic advising. Always consult with your official UMD academic advisor before making major decisions about your course of study."},

    { question: "Where does the data come from?", answer: "We analyze job postings from sources like LinkedIn, Indeed, and Glassdoor through OpenWebNinja API. Course and major information comes from UMD's official academic catalog using umd.io"}
  ];

  //tips
  const tips = [ "Try searching by job titles, not just majors", "Use skills or interests if you're undecided",
    "Compare multiple majors instead of looking for a single \"perfect\" answer","Use this tool alongside advising, not instead of it"];

  return (
    <Layout>
      <PageHero 
        title="Help"
        imageSrc="https://d3rw207pwvlq3a.cloudfront.net/attachments/000/064/622/original/shutterstock_1077839366_%281%29.jpg?1568862103"
      />

      {/* how it works section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl text-black mb-12 tracking-tight">
          How It Works
        </h2>
        <div className="max-w-3xl space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white text-xl">{step.number}</span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl text-black mb-2">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl text-black mb-12 tracking-tight">
            FAQ
          </h2>
          <div className="max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl text-black">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-6 h-6 text-gray-600 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tips section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl text-yellow-500 mb-8 tracking-tight">
          Tips for Getting the Most Out of Major Decisions
        </h2>
        <div className="max-w-3xl">
          <ul className="space-y-4">
            {tips.map((tip, index) => (
              <li 
                key={index}
                className="text-lg text-black leading-relaxed flex items-start gap-3"
              >
                <span className="text-red-600 text-2xl flex-shrink-0">
                  •
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}