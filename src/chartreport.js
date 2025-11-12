import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SiderealChartPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const handleImageClick = () => {
    setIsEnlarged(true);
  };

  const handleClose = () => {
    setIsEnlarged(false);
  };

  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      text: "The MTZ Natal chart reading is all encompassing and exact. An absolute must for those interested in astrology and who want to be pointed in a true direction.\n\nThank you Athen for creating such a in-depth and accessible reading. This is truly a wonderful offering which aligns soulfully.",
      name: "Su & Justin Tan",
      location: "Alberta, Canada"
    },
    {
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      text: "I have been a staunch follower of Athen's True Sidereal Astrology for a long time now, so I jumped at the chance for him to take a look at my chart and receive an e-reading. It has been enlightening, eye-opening and helped me to understand myself on a deeper level.\n\nI shall treasure my reading and continue to study it to better myself and my life. Thank you Athen!",
      name: "Molly Jade",
      location: "London, UK"
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      text: "This reading has given me such profound insights into my life path and purpose. The accuracy and depth of information is truly remarkable. I finally understand patterns that have been present throughout my entire life.\n\nAthen's approach to True Sidereal Astrology is refreshingly authentic and grounded in real astronomical positions. Highly recommended!",
      name: "Marcus Chen",
      location: "Singapore"
    },
    {
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      text: "As someone skeptical of astrology, this reading completely changed my perspective. The precision and relevance of the insights were undeniable. It's like someone handed me a manual for understanding myself.\n\nThe report is beautifully formatted and easy to navigate. Worth every penny and more. Thank you for this incredible work!",
      name: "Sarah Williams",
      location: "Sydney, Australia"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">

{isEnlarged && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto flex items-start justify-center p-4"
          onClick={handleClose}
        >
          <div className="relative my-8">
        
            <button
              onClick={handleClose}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-4xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            
            
            <img 
   src="./report-cover-double.png"
              alt="Report Cover Enlarged" 
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
     
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-light text-center mb-6 tracking-wide">
          TRUE SIDEREAL CHART REPORT + E-READING
        </h1>
        
        <div className="border-t border-gray-300 mb-8"></div>
        
        <p className="text-center text-gray-700 mb-12 italic">
          "Everyone deserves to have clarity about themselves and their lives."- Athen Chimenti
        </p>

       
        <div className="flex justify-center items-center my-12 relative">
  <button  onClick={handleImageClick} className="relative z-10 hover:scale-105 transition-transform">
    <img 
    src="./report-cover-double.png"
      alt="Report Cover" 
      className="max-w-sm md:max-w-md rounded-lg shadow-xl"
    />
  </button>
  <div className="absolute inset-0 bg-gray-100 -z-10"></div>
</div>


        <h2 className="text-2xl md:text-3xl font-light text-center mb-8 tracking-wide">
          KNOW THE REAL YOU. USING THE REAL SKY.
        </h2>
        
        <div className="border-t border-gray-300 mb-12"></div>

        <p className="text-center text-gray-700 max-w-4xl mx-auto mb-16 leading-relaxed">
          One of the greatest gifts of true sidereal astrology is the ability to know your true self. This detailed and easy to follow report guides you to embodying who you really are - which was reflected in the true sky when you were born.
        </p>

       
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto mb-12">
          
          <div>
            <h3 className="text-xl font-normal mb-6 text-center">Complete twelve-page natal chart report</h3>
            <div className="space-y-4 text-gray-700">
              <p className="text-center">Your true planetary positions + Chiron the healer</p>
              <p className="text-center">Your ascendant, chart ruler, MC, & MC ruler</p>
              <p className="text-center">Your life path Lunar Nodes</p>
              <p className="text-center">Aspects to all planets, angles, & nodes</p>
            </div>
          </div>

         
          <div>
            <h3 className="text-xl font-normal mb-6 text-center">Two-page natal chart reading</h3>
            <div className="space-y-4 text-gray-700">
              <p className="text-center">All thirteen signs including Ophiuchus</p>
              <p className="text-center">Your planetary polarities, elements, & modalities</p>
              <p className="text-center">Your chart composition & hemispheric emphasis</p>
              <p className="text-center">Your natal chart, aspectarian, & tables for easy reference</p>
            </div>
          </div>
        </div>

        <p className="text-center font-semibold text-gray-900 mb-8">
          Imagine living with clarity and confirmation in who you truly are.
        </p>

   
        <div className="max-w-2xl mx-auto mb-16">
          <h3 className="text-center font-semibold text-gray-900 mb-6">To get started:</h3>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold">1.</span> Enter your birth details during the checkout process.</p>
            <p><span className="font-semibold">2.</span> Receive your report in your inbox within 10–15 minutes.</p>
            <p><span className="font-semibold">3.</span> Read your report and live your life with clarity and confirmation.</p>
          </div>
        </div>

     
      </div>

  
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative">
          
            <div className="hidden md:grid md:grid-cols-2 gap-8">
              {testimonials.slice(currentSlide, currentSlide + 2).concat(
                currentSlide + 2 > testimonials.length 
                  ? testimonials.slice(0, (currentSlide + 2) - testimonials.length)
                  : []
              ).slice(0, 2).map((testimonial, idx) => (
                <div key={idx} className="bg-white p-8 shadow-lg">
                  <div className="flex items-start gap-6 mb-4">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-24 h-24 rounded object-cover flex-shrink-0"
                    />
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {testimonial.text}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-700">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>

           
            <div className="md:hidden">
              <div className="bg-white p-8 shadow-lg">
                <div className="flex flex-col items-center gap-4 mb-4">
                  <img 
                    src={testimonials[currentSlide].image}
                    alt={testimonials[currentSlide].name}
                    className="w-32 h-32 rounded object-cover"
                  />
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line text-center">
                    {testimonials[currentSlide].text}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700">{testimonials[currentSlide].name}</p>
                  <p className="text-gray-500 text-sm">{testimonials[currentSlide].location}</p>
                </div>
              </div>
            </div>

            
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

        
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentSlide ? 'bg-indigo-600' : 'bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

   
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-center text-xl md:text-2xl mb-8">
          HAVE QUESTIONS ABOUT THE REPORT + E-READING?{' '}
          <a href="#contact" className="text-indigo-600 hover:text-indigo-700">
            CONTACT ATHEN
          </a>
        </h3>

   
      </div>
    </div>
  );
}