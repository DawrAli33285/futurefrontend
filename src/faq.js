import React, { useState, useRef, useEffect } from 'react';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState(['report-vs-readings']);

  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const FAQItem = ({ id, question, children }) => {
    const isOpen = openItems.includes(id);
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
    }, [children]);
    
    return (
      <section id={id} className="mb-6">
        <button
          onClick={() => toggleItem(id)}
          className="flex items-start gap-3 w-full text-left hover:text-gray-600 transition-colors"
        >
          <span 
            className="text-sm mt-1"
            style={{ 
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              color: isOpen ? '#5d4fad' : 'black',
              transition: 'all 0.3s ease-in-out'
            }}
          >
            ▶
          </span>
          <h3 
            className="text-base font-bold"
            style={{
              color: isOpen ? '#5d4fad' : 'black',
              transition: 'color 0.2s ease-in-out'
            }}
          >
            {question}
          </h3>
        </button>
        <div 
          ref={contentRef}
          className="overflow-hidden"
          style={{ 
            maxHeight: isOpen ? `${height}px` : '0px',
            opacity: isOpen ? 1 : 0,
            transition: 'max-height 0.4s ease-in-out, opacity 0.4s ease-in-out'
          }}
        >
          <div className="ml-6 mt-3 text-gray-700 space-y-3 pb-2">
            {children}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
     
        <h1 className="text-[26px] md:text-[30px] font-light text-center mb-4">MTZ FAQ</h1>
        <p className="text-center text-sm tracking-widest uppercase text-gray-600 mb-8">
          Answers To The Most Common Questions
        </p>
        
        <div className="border-t border-gray-300 mb-12"></div>

        <p className="text-center mb-12">
          <b>For general questions about sidereal please read our in-depth article on{' '}
          <a href="https://masteringthezodiac.com/sidereal-astrology" className="text-blue-600 hover:underline">
            sidereal astrology
          </a>
          . It answers all common questions about sidereal astrology and the true sidereal zodiac.</b>
        </p>

   
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 tracking-wide">
          TRUE SIDEREAL ASTROLOGY
        </h2>

        <FAQItem id="signs-different" question="Why are my signs different?">
          <p>
            Your signs are different because{' '}
            <a href="https://masteringthezodiac.com#learnmore" className="text-blue-600 hover:underline">
              true sidereal astrology
            </a>{' '}
            uses the <b>actual location of the planets in the sky</b>. Mainstream western astrology (tropical) doesn't use where the planets actually are - it uses a{' '}
            <a href="https://masteringthezodiac.com/sidereal-astrology#vs-tropical" className="text-blue-600 hover:underline">
              seasonal calendar system
            </a>{' '}
            instead.
          </p>
          <p>
            We believe the true sidereal chart is the most foundational chart in astrology. It shows what constellations the planets were actually in at the time of your birth - the same sky our ancestors looked at for thousands of years before simplified calendar systems.
          </p>
        </FAQItem>

        <FAQItem id="ophiuchus" question="What is Ophiuchus? What is this symbol ⛎︎?">
          <p>
            <a href="https://masteringthezodiac.com/ophiuchus-in-astrology" className="text-blue-600 hover:underline">
              Ophiuchus
            </a>{' '}
            is the <b>13th sign of the zodiac</b> and shares the same part of the sky as Scorpio. Because Ophiuchus is situated on the ecliptic (the path through which the planets orbit the Sun), it is considered a zodiac sign.
          </p>
          <p>
            Both Ophiuchus and Scorpio carry 8th house energies of transformation and depth. The Sun passes through Ophiuchus from December 7th-18th in our{' '}
            <a href="https://masteringthezodiac.com/midpoint-method" className="text-blue-600 hover:underline">
              Midpoint Method
            </a>
            .
          </p>
        </FAQItem>

        <FAQItem id="sun-sign-dates" question="What are the true sidereal Sun Sign dates?">
          <p>
            True sidereal dates are <b>different from both tropical and mainstream sidereal systems</b>. We use the actual uneven sizes of the constellations - some signs last only 18 days (Cancer) while others last up to 50 days (Virgo) because of their respective size in the sky. We also include Ophiuchus, the 13th sign.
          </p>
          <p>
            View all the{' '}
            <a href="https://masteringthezodiac.com/sidereal-astrology-dates" className="text-blue-600 hover:underline">
              true sidereal sun sign dates
            </a>{' '}
            to find your actual Sun Sign.
          </p>
        </FAQItem>

        <FAQItem id="why-sidereal" question="Why do you use true sidereal astrology?">
          <p>
            We use{' '}
            <a href="https://masteringthezodiac.com#learnmore" className="text-blue-600 hover:underline">
              true sidereal
            </a>{' '}
            because it shows the <b>actual placement of the planets</b> in the constellations at your birth. This is the most ancient form of astrology - before calendars and clocks, we simply looked up at the night sky and noticed patterns with our lives.
          </p>
          <p>
            While we think tropical is accurate as a secondary system, true sidereal is the most foundational chart in astrology. It shows what our ancestors saw for thousands of years, not a simplified calendar system.
          </p>
        </FAQItem>

    
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          CHART INTERPRETATION & LEARNING
        </h2>

        <FAQItem id="interpretations" question="Do you use different interpretations than tropical astrology?">
          <p>
            No, <b>we use the same interpretations as mainstream Western astrology</b>. The tropical and sidereal interpretations are practically identical.
          </p>
          <p>
            The main difference is how we interpret the angles like the ascendant. While traditional astrology sees the ascendant as your "persona," we view the sidereal ascendant as who you are <b>becoming</b> - not what you were born with, but what life helps you develop. This is also true for the other angles such as the Midheaven, whereby the angle shows the life experiences not the personality characteristics.
          </p>
        </FAQItem>

        <FAQItem id="oppositions" question="How do you interpret oppositions that aren't opposite signs?">
          <p>
            In true sidereal, we still read them as oppositions - specifically, the <b>opposing parts</b> of those signs.
          </p>
          <p>
            <b>Example:</b> Leo opposite Pisces<br />
            • The Leo part in opposition to Pisces emphasizes self-oriented, passionate desires and pursuits<br />
            • The Pisces part in opposition to Leo emphasizes selflessness and surrender to what life wants for us
          </p>
          <p>
            You don't need to get too technical - simply view them as opposites and you'll see how these energies can be balanced, even though they're not classically opposite signs.
          </p>
        </FAQItem>

        <FAQItem id="birth-chart" question="What's the most important thing to look at in my birth chart?">
          <p>
            We recommend starting with your{' '}
            <a href="https://masteringthezodiac.com/north-node-south-node-in-astrology" className="text-blue-600 hover:underline">
              North and South Nodes
            </a>{' '}
            (Rahu and Ketu). They are the most important energies for life direction and cultivating balance between physical and spiritual needs.
          </p>
          <p>
            In your chart, look for two horseshoe symbols - the 'n' is the North Node and the 'u' is the South Node. Note their house and sign placements. This is by far the most powerful part of the chart and what our readings are centered around.
          </p>
          <p>
            For a tutorial on how to read your birth chart check out our in-depth article on{' '}
            <a href="https://masteringthezodiac.com/how-to-read-a-birth-chart" className="text-blue-600 hover:underline">
              how to read a birth chart
            </a>
            .
          </p>
        </FAQItem>

        <FAQItem id="no-birth-time" question="What if I don't know my birth time?">
          <p>Without birth time, you can still see:</p>
          <p>
            • <b>Planet signs</b> - Your personality characteristics<br />
            • <b>Planetary aspects</b> - Your strengths and challenges
          </p>
          <p>
            What's missing are the houses, which show specific life areas like relationships and career. We still recommend a{' '}
            <a href="https://masteringthezodiac.com/sidereal-astrology-readings" className="text-blue-600 hover:underline">
              reading
            </a>{' '}
            without birth time if you want to know more about your true self and personality. You'll get about two-thirds of your chart's insights.
          </p>
          <p>
            If you are reading your own chart, you can also set the Sun as the ascendant to get house interpretations for the outer-consciousness perspective.
          </p>
        </FAQItem>

        <FAQItem id="node-vs-ascendant" question="How is the north node different from the ascendant?">
          <p>The key difference is <b>karma</b>:</p>
          <p>
            <b>The nodes</b> are karmic points. The north node represents karma you're building in this life. It requires careful balance with the south node to avoid extremes. Going too far into either node creates challenges.
          </p>
          <p>
            <b>The ascendant and chart ruler</b> are simply this life's experiences without karmic weight. They're beneficial to develop without the same risk of imbalance.
          </p>
          <p>
            The nodes teach us balance through repeated cycles and life lessons. The angles like the ascendant show straightforward growth and development.
          </p>
        </FAQItem>

       
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          TECHNICAL QUESTIONS
        </h2>

        <FAQItem id="degrees" question="Do you use degrees with true sidereal astrology?">
          <p>
            You can. However, we personally don't use degrees with true sidereal. Since true sidereal uses the <b>actual uneven sizes of the constellations</b>, degrees become ambiguous. Degrees are useful when signs are an even 30-degrees, but in true sidereal the signs are different sizes, so degrees don't have practical meaning.
          </p>
          <p>
            If you purchase the{' '}
            <a href="https://masteringthezodiac.com/sidereal-report" className="text-blue-600 hover:underline">
              report
            </a>{' '}
            and would like to see degrees, we can generate your chart with degrees upon request.
          </p>
        </FAQItem>

        <FAQItem id="iau-dates" question="Are the IAU dates (Nov 30 - Dec 17 for Ophiuchus) correct?">
          <p>
            The IAU boundaries you see on Wikipedia are <b>for astronomy, not astrology</b>. They don't reference the ecliptic (the Sun's path). We use the{' '}
            <a href="https://masteringthezodiac.com/midpoint-method" className="text-blue-600 hover:underline">
              Midpoint Method
            </a>
            , which is more accurate for astrology as it references the ecliptic. With this method, the Sun is in Ophiuchus from <b>December 7th-18th</b>.
          </p>
          <p>
            Also please keep in mind that there are no visible divisions in the sky. Dates within three days of two signs are a blend of both signs.
          </p>
        </FAQItem>

        <FAQItem id="13-houses" question="If there's a 13th sign, why not 13 houses?">
          <p>
            We use 12 houses because <b>Scorpio and Ophiuchus share the same part of the sky</b> - the 8th house region.
          </p>
          <p>
            If you look at the constellations, they span above and below each other perfectly along the ecliptic. Both carry 8th house energies of transformation and depth. This is why the 12-house system remains accurate even with 13 zodiac signs.
          </p>
          <p>
            If you were to include a 13th house it would be the second half of the 8th - where Ophiuchus sits in the sky.
          </p>
        </FAQItem>

        <FAQItem id="equal-house" question="Why do you use Equal House system instead of Placidus?">
          <p>
            We prefer Equal House because it shows <b>the sky as we actually see it</b>. Other systems stretch and shrink houses to fit other points in the chart. For example, quadrant house systems like Placidus stretch and shrink the houses to North, East, South, and West. Another example is the Whole Sign house system which sets the houses to the zodiac signs. While these systems are accurate, Equal House provides a more fundamental view by keeping the sky's natural proportions.
          </p>
          <p>
            We still find other house systems like Placidus accurate. We just find that Equal House best represents the visible sky without distortion.
          </p>
        </FAQItem>

        <FAQItem id="astrocartography" question="Is sidereal astrocartography different from tropical?">
          <p><b>No, they're identical.</b></p>
          <p>
            Astrocartography charts reference the <b>houses</b> planets are in, not the signs. The planetary lines show where planets fall on the four angles (North, East, South, West) - their house positions.
          </p>
          <p>
            Since houses remain the same in both systems, your astrocartography map is unchanged whether using tropical or sidereal.
          </p>
        </FAQItem>

        
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          SOFTWARE & TOOLS
        </h2>

        <FAQItem id="true-sky" question="What is True Sky astrology software?">
          <p>
            <a href="https://masteringthezodiac.com/online-astrology-software" className="text-blue-600 hover:underline">
              True Sky
            </a>{' '}
            is our <b>online astrology software</b> designed for everyone - from complete beginner to professional astrologer. No astrology knowledge is needed thanks to its one-click design and built-in interpretations.
          </p>
          <p>
            Works instantly on any device - Mac, PC, tablet, or phone. Simply login and get <b>all chart types calculated with one click</b> (natal, transit, progression, return, synastry, composite). Save up to 5,000 charts that sync across all your devices. Free tier available or $15/month.
          </p>
        </FAQItem>

        <FAQItem id="true-sky-tropical" question="Why does True Sky astrology software default to tropical?">
          <p>
            <a href="https://masteringthezodiac.com/online-astrology-software" className="text-blue-600 hover:underline">
              True Sky
            </a>{' '}
            astrology software defaults to tropical settings when first loaded. The software is for all forms of astrology and tropical is still the expected standard. To use our <b>true sidereal system</b>, go to the SETTINGS section and switch to:
          </p>
          <p>
            • Zodiac: Midpoint (true sidereal)<br />
            • House: Equal<br />
            • Coordinate: Topocentric
          </p>
          <p>
            These settings will give you accurate true sidereal calculations using our{' '}
            <a href="https://masteringthezodiac.com/midpoint-method" className="text-blue-600 hover:underline">
              Midpoint Method
            </a>
            .
          </p>
        </FAQItem>

        <FAQItem id="prometheus" question="Are you still offering Prometheus software?">
          <p>
            Yes, we still recommend{' '}
            <a href="https://masteringthezodiac.com/prometheus-astrology-software" className="text-blue-600 hover:underline">
              Prometheus
            </a>{' '}
            for those that want a technical desktop software with true sidereal functionality. However, the Prometheus server is currently down and we're unable to issue new licenses at this time. The developer is aware of the issue, though there's no ETA for resolution.
          </p>
          <p>
            We recommend using our{' '}
            <a href="https://masteringthezodiac.com/online-astrology-software" className="text-blue-600 hover:underline">
              True Sky
            </a>{' '}
            astrology software for all of your true sidereal astrology calculations. It's available for all devices, including mobile, tablet, and Mac.
          </p>
        </FAQItem>

        <FAQItem id="human-design" question="Where can I calculate my true sidereal Human Design chart?">
          <p>
            We recommend using{' '}
            <a href="https://www.geneticmatrix.com/" className="text-blue-600 hover:underline" target="_blank" rel="nofollow noopener">
              GeneticMatrix
            </a>{' '}
            (paid version) for true sidereal HD charts. Under Astro HD Sidereal settings, use:
          </p>
          <p>
            • Ayanamsa: User Defined SVP<br />
            • Fixed Sidereal Vernal Point: 31.2836<br />
            • Yearly Incremental SVP: 0.00<br />
            • Reference Year: 2000<br />
            Then choose the true sidereal-M (Midpoint) setting.
          </p>
        </FAQItem>

     
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          SERVICES & RESOURCES
        </h2>

        <FAQItem id="report-vs-readings" question="How is the report different from personal readings?">
          <p>
            <b>The Report:</b> A comprehensive printout of all your placements with detailed interpretations. Perfect for understanding your personality, strengths, and challenges.
          </p>
          <p>
            <b>Personal Readings:</b> Focused on your unique life path and how to align with it for greater fulfillment. Provides personalized guidance for working with your chart.
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
        </FAQItem>

        <FAQItem id="books" question="What astrology books do you recommend?">
          <p>
            We recommend four books for learning the basics of astrology. Although written by tropical astrologers, these books provide an excellent starting point. Starting from least to more complex:
          </p>
          <p>
            •{' '}
            <a href="https://amzn.to/3WtLNf7" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
              Astrology for Yourself
            </a>
            <br />
            •{' '}
            <a href="https://amzn.to/3XyrEpt" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
              Chart Interpretation Handbook
            </a>
            <br />
            •{' '}
            <a href="https://amzn.to/3XAELpZ" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
              Predictive Astrology
            </a>
            <br />
            •{' '}
            <a href="https://amzn.to/3XVTP19" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
              The Changing Sky
            </a>
          </p>
        </FAQItem>

        <FAQItem id="chart-questions" question="I have questions about my chart - who can help?">
          <p>
            For questions or interpretations of your chart, we recommend booking a reading with our astrologer{' '}
            <a href="https://masteringthezodiac.com/annamaria-bio" className="text-blue-600 hover:underline">
              Annamaria Rajko
            </a>
            . She specializes in Evolutionary Astrology using true sidereal astrology.
          </p>
          <p>
            Visit our{' '}
            <a href="https://masteringthezodiac.com/sidereal-astrology-readings" className="text-blue-600 hover:underline">
              readings page
            </a>{' '}
            to learn more about the different types of readings she offers for understanding your unique chart and life path.
          </p>
        </FAQItem>
      </div>
    </div>
  );
}