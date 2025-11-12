import React, { useState } from 'react';
import { ChevronRight, Youtube, Facebook, Instagram } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from './baseurl';

export default function ContactPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      id: 1,
      question: "Why are my signs different?",
      answer: (
        <>
          <p className="mb-4">
            Your signs are different because{' '}
            <a href="https://masteringthezodiac.com#learnmore" className="text-blue-600 hover:underline">
              true sidereal astrology
            </a>{' '}
            uses the <strong>actual location of the planets in the sky</strong>. Mainstream western astrology (tropical) doesn't use where the planets actually are - it uses a{' '}
            <a href="https://masteringthezodiac.com/sidereal-astrology#vs-tropical" className="text-blue-600 hover:underline">
              seasonal calendar system
            </a>{' '}
            instead.
          </p>
          <p>
            We believe the true sidereal chart is the most foundational chart in astrology. It shows what constellations the planets were actually in at the time of your birth - the same sky our ancestors looked at for thousands of years before simplified calendar systems.
          </p>
        </>
      )
    },
    {
      id: 2,
      question: "Do we use degrees with true sidereal astrology?",
      answer: (
        <>
          <p className="mb-4">
            You can. However, we personally don't use degrees with true sidereal. Since true sidereal uses the <strong>actual uneven sizes of the constellations</strong>, degrees become ambiguous. Degrees are useful when signs are an even 30-degrees, but in true sidereal the signs are different sizes, so degrees don't have practical meaning.
          </p>
          <p>
            If you purchase the{' '}
            <a href="https://masteringthezodiac.com/sidereal-report" className="text-blue-600 hover:underline">
              report
            </a>{' '}
            and would like to see degrees, we can generate your chart with degrees upon request.
          </p>
        </>
      )
    },
    {
      id: 3,
      question: "How is the report different from personal readings?",
      answer: (
        <>
          <p className="mb-4">
            <strong>The Report:</strong> A comprehensive printout of all your placements with detailed interpretations. Perfect for understanding your personality, strengths, and challenges.
          </p>
          <p className="mb-4">
            <strong>Personal Readings:</strong> Focused on your unique life path and how to align with it for greater fulfillment. Provides personalized guidance for working with your chart.
          </p>
          <p>
            Choose the{' '}
            <a href="https://masteringthezodiac.com/sidereal-report" className="text-blue-600 hover:underline">
              report
            </a>{' '}
            for detailed self-knowledge, or a{' '}
            <a href="https://masteringthezodiac.com/sidereal-astrology-readings" className="text-blue-600 hover:underline">
              reading
            </a>{' '}
            for customized life path guidance.
          </p>
        </>
      )
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields', { containerId: 'contactus' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/contactUsEmail`, formData);

      if (response.data.success) {
        toast.success('Email sent successfully! We will get back to you soon.', { containerId: 'contactus' });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send email. Please try again.';
      toast.error(errorMessage, { containerId: 'contactus' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer containerId="contactus" />
      
      <div className="max-w-6xl mx-auto px-6 py-16">
     
        <div className="mb-20">
          <h2 className="text-3xl font-light mb-8">
            Frequently Asked Questions
          </h2>

          {faqs.map((faq) => (
            <div key={faq.id} className="mb-4">
              <div
                className="bg-gray-50 hover:bg-gray-100 p-4 rounded cursor-pointer transition-colors duration-200 flex items-center"
                onClick={() => toggleFaq(faq.id)}
              >
                <ChevronRight
                  className={`w-5 h-5 text-gray-700 mr-3 transition-transform duration-300 flex-shrink-0 ${
                    expandedFaq === faq.id ? 'rotate-90' : ''
                  }`}
                />
                <h3 className="font-bold text-gray-800">{faq.question}</h3>
              </div>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="bg-gray-50 p-6 text-gray-800 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}

          <a
            href="/faq"
            className="block mt-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded transition-colors duration-200"
          >
            <div className="flex items-center">
              <ChevronRight className="w-5 h-5 mr-3" />
              <strong>All frequently asked questions</strong>
            </div>
          </a>
        </div>

     
        <h1 className="text-5xl md:text-6xl font-extralight text-left mb-16 tracking-wide">
          Contact
        </h1>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8">
       
          <div className="min-w-0">
            <p className="mb-4 text-gray-800 leading-relaxed">
              Didn't find the answer to your question in the{' '}
              <a href="/faq" className="text-blue-600 hover:underline">
                FAQ page
              </a>
              ? We are happy to answer any questions you might have.
            </p>
            
            <p className="mb-4 text-gray-800 leading-relaxed">
              E-mail{' '}
              <a href="mailto:contact@masteringthezodiac.com" className="text-blue-600 hover:underline">
                contact@masteringthezodiac.com
              </a>
            </p>

            <p className="mb-6 text-gray-800 leading-relaxed">Or, simply use the form below:</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Your message..."
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Email'}
              </button>
            </form>
          </div>

      
          <div>
            <div className="flex gap-6 mb-12">
              <a
                href="https://www.youtube.com/masteringthezodiac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Youtube className="w-12 h-12" />
              </a>
              <a
                href="https://www.facebook.com/masteringthezodiac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-12 h-12" />
              </a>
              <a
                href="https://www.instagram.com/masteringthezodiac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Instagram className="w-12 h-12" />
              </a>
            </div>

            <h2 className="text-2xl font-normal mb-4 mt-12">
              <a href="/insiders" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Join Newsletter
              </a>
            </h2>

            <h2 className="text-2xl font-normal mb-4">
              <a href="/partners" target="_blank" rel="nofollow noopener noreferrer" className="text-blue-600 hover:underline">
                Affiliate Program
              </a>
            </h2>

            <h2 className="text-2xl font-normal">
              <a href="https://donate.stripe.com/7sI00WdEAaX250s28y" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Donate
              </a>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}