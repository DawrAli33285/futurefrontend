import React, { useState, useRef, useEffect } from 'react';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState([]);

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
     
        <h1 className="text-[26px] md:text-[30px] font-light text-center mb-4">TRUE SKY PSYCHOLOGY — FAQ</h1>
        <p className="text-center text-sm tracking-widest uppercase text-gray-600 mb-8">
          Answers To The Most Common Questions
        </p>
        
        <div className="border-t border-gray-300 mb-12"></div>

        
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 tracking-wide">
          BIG 3 (SUN, MOON, RISING)
        </h2>

        <FAQItem id="sun-sign" question="What does my Sun sign really say about me?">
          <p>
            Your Sun sign shows your core life force, identity, and purpose. It reflects how you express your will, creativity, and consciousness over time. In True Sidereal astrology, your Sun sign is based on the actual constellation behind the Sun, giving a more astronomically accurate picture of your nature and growth path.
          </p>
        </FAQItem>

        <FAQItem id="moon-sign" question="How does my Moon sign affect my emotions and daily moods?">
          <p>
            Your Moon sign governs your emotional body, subconscious patterns, instincts, and how you process experiences internally. It influences your needs for safety, comfort, and connection, and it often shows how you react emotionally before logic kicks in.
          </p>
        </FAQItem>

        <FAQItem id="rising-sign" question="Why is my Rising sign so important in first impressions and energy?">
          <p>
            Your Rising (Ascendant) sign represents how you meet the world and how the world meets you. It affects your physical presence, mannerisms, and the energetic "filter" through which you experience life. It also sets up the structure of your entire birth chart.
          </p>
        </FAQItem>

        <FAQItem id="big3-interaction" question="How do the Big 3 interact in my life?">
          <p>Think of the Big 3 as a system:</p>
          <p>
            <b>Sun</b> = who you are becoming<br />
            <b>Moon</b> = how you feel and react<br />
            <b>Rising</b> = how you appear and initiate
          </p>
          <p>
            When aligned, life feels coherent. When in tension, you may feel pulled in different directions. Their interaction shapes your personality, relationships, and growth themes.
          </p>
        </FAQItem>

        <FAQItem id="override" question="Can my Moon or Rising sign override my Sun sign?">
          <p>
            They don't override it, but they can dominate in certain situations. Emotional moments activate the Moon. Social or unfamiliar environments activate the Rising sign. Over time, the Sun becomes more expressed as you grow into yourself.
          </p>
        </FAQItem>

        <FAQItem id="sidereal-big3" question="How does True Sidereal astrology change my Big 3 interpretation?">
          <p>
            True Sidereal astrology uses the real sky positions of the Sun, Moon, and planets instead of a fixed seasonal zodiac. This often shifts people's signs and produces interpretations that match lived experience more closely.
          </p>
        </FAQItem>

        <FAQItem id="aspects" question="How do planetary aspects affect my Sun, Moon, or Rising?">
          <p>
            Aspects show how planets interact with your Big 3. Supportive aspects enhance confidence and flow, while challenging aspects create pressure that leads to growth, self-mastery, and integration.
          </p>
        </FAQItem>

      
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          CHAKRAS & PLANET ALIGNMENT
        </h2>

        <FAQItem id="chakra-planets" question="Which planets rule which chakras?">
          <p>A common energetic mapping:</p>
          <p>
            <b>Root Chakra — Saturn</b><br />
            Grounding, survival, structure, karma, time, discipline
          </p>
          <p>
            <b>Sacral Chakra — Venus</b><br />
            Desire, pleasure, creativity, emotional bonding
          </p>
          <p>
            <b>Solar Plexus — Sun & Mars</b><br />
            Willpower, identity, action, confidence, vitality
          </p>
          <p>
            <b>Heart Chakra — Venus</b><br />
            Love, harmony, beauty, relational balance
          </p>
          <p>
            <b>Throat Chakra — Mercury</b><br />
            Voice, truth, language, thought made sound
          </p>
          <p>
            <b>Third Eye — Jupiter</b><br />
            Wisdom, vision, higher mind, meaning, philosophy
          </p>
          <p>
            <b>Crown Chakra — Moon</b><br />
            Divine mind, cosmic consciousness, psychic field, universal memory
          </p>
        </FAQItem>

        <FAQItem id="transits-chakra" question="How do planetary transits affect my chakra energy?">
          <p>
            Planetary transits stimulate the chakra related to that planet's function. Mercury affects communication and the throat. Saturn affects safety and the root. The Moon influences emotional processing through the sacral and heart centers.
          </p>
        </FAQItem>

        <FAQItem id="misaligned-chakra" question="Can misaligned chakras make planetary influences stronger or weaker?">
          <p>
            Yes. A blocked chakra can exaggerate or distort planetary energy, while an aligned chakra allows that energy to express cleanly and constructively.
          </p>
        </FAQItem>

        <FAQItem id="retrogrades-chakra" question="How do retrogrades influence chakra energy?">
          <p>
            Retrogrades turn energy inward for review and healing. Mercury retrograde highlights throat chakra themes and nervous system regulation. Venus retrograde works through the heart and self-worth. Mars retrograde affects willpower and solar plexus integration.
          </p>
        </FAQItem>

        <FAQItem id="align-chakras" question="How can I align my chakras with current planetary energies?">
          <p>
            Through breathwork, sound healing, meditation, movement, intention-setting, and frequency practices timed with planetary cycles.
          </p>
        </FAQItem>

        <FAQItem id="eclipses-moons" question="How do eclipses or full moons affect energy centers?">
          <p>
            Eclipses initiate deep resets stored in the chakras. Full moons heighten emotional sensitivity, especially in the heart and solar plexus, often bringing buried material to the surface for integration.
          </p>
        </FAQItem>

        <FAQItem id="signs-chakra" question="Can my Sun, Moon, or Rising sign influence chakra strengths or blocks?">
          <p>
            Yes. Fire and air signs often activate upper chakras (throat, third eye, crown). Earth and water signs tend to emphasize lower and heart centers (root, sacral, heart).
          </p>
        </FAQItem>

        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          TRUE SIDEREAL / SCIENCE-BASED ASTROLOGY
        </h2>

        <FAQItem id="sky-differ" question="How does the sky today differ from the zodiac I learned in school?">
          <p>
            Due to Earth's slow axial wobble (precession), the constellations have shifted. The zodiac taught in school no longer aligns with the actual sky.
          </p>
        </FAQItem>

        <FAQItem id="visible-planets" question="Which planets are actually visible in the sidereal sky right now?">
          <p>
            Visibility changes monthly, but the Sun, Moon, Venus, Mars, Jupiter, and Saturn are often observable depending on season and location.
          </p>
        </FAQItem>

        <FAQItem id="constellations-2026" question="How do constellations line up with astrology in 2026?">
          <p>
            The Sun continues moving through the real constellations rather than symbolic sign divisions, creating greater astronomical alignment.
          </p>
        </FAQItem>

        <FAQItem id="science-energy" question="How do we measure astrology scientifically without ignoring energy work?">
          <p>
            Astronomical positions are measurable. Energetic influence is observed through resonance, biological rhythms, and long-term pattern correlation.
          </p>
        </FAQItem>

        <FAQItem id="belief" question="Can astrology affect my life even if I don't believe in it?">
          <p>
            Yes. Just as gravity works regardless of belief, planetary cycles influence Earth systems whether consciously acknowledged or not.
          </p>
        </FAQItem>

        <FAQItem id="precession" question="How does the precession of the equinoxes shift signs over time?">
          <p>
            It moves the equinox point backward through the constellations over about 26,000 years, causing the tropical zodiac to drift from the stars.
          </p>
        </FAQItem>

       
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          TRUE 13-SIGN / SIDEREAL ASTROLOGY
        </h2>

        <FAQItem id="13th-sign" question="Why is there a 13th sign in astrology, and what is it?">
          <p>
            Ophiuchus is the 13th zodiac constellation the Sun actually passes through along the ecliptic. It has always existed astronomically but was excluded from symbolic systems.
          </p>
        </FAQItem>

        <FAQItem id="ophiuchus-change" question="How does Ophiuchus change my zodiac sign?">
          <p>
            It can shift your Sun sign and changes the spacing of the zodiac based on real constellation sizes rather than equal divisions.
          </p>
        </FAQItem>

        <FAQItem id="tropical-vs-sidereal" question="What's the difference between Tropical astrology and Sidereal astrology?">
          <p>
            Tropical astrology is seasonal and symbolic. Sidereal astrology is based on actual star positions in the sky.
          </p>
        </FAQItem>

        <FAQItem id="accuracy" question="How accurate is Tropical astrology today compared to Sidereal?">
          <p>
            Tropical astrology is approximately 24 degrees off from the real sky. Sidereal reflects true astronomical placement.
          </p>
        </FAQItem>

        <FAQItem id="planetary-positions" question="How do planetary positions today align with real constellations?">
          <p>
            Sidereal astrology tracks planets within their actual star fields instead of symbolic seasonal signs.
          </p>
        </FAQItem>

        <FAQItem id="find-chart" question="How do I find my true 13-sign chart?">
          <p>
            By generating a chart using real-sky sidereal calculations rather than tropical software.
          </p>
        </FAQItem>

        <FAQItem id="both-signs" question="Can someone be influenced by both the 'old' sign and the 13th sign?">
          <p>
            Yes. Psychological identity may remain tied to the learned sign, while the true sign reflects the deeper energetic blueprint.
          </p>
        </FAQItem>

        <FAQItem id="readings-effect" question="How does True Sidereal astrology affect personality, love, and career readings?">
          <p>
            It refines emotional compatibility, vocational strengths, and life timing by aligning them with real cosmic positions.
          </p>
        </FAQItem>

        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          ABOUT TRUE SIDEREAL ASTROLOGY
        </h2>

        <FAQItem id="what-is-sidereal" question="What is True Sidereal Astrology?">
          <p>
            True Sidereal Astrology uses the visible sky as it actually exists.
          </p>
          <p>
            Most Western astrology is based on tropical astrology, which is fixed to the seasons rather than the real positions of stars and constellations. Over the past 2,000 years, the sky has shifted due to precession, meaning tropical signs are now often one to two signs off from astronomical reality.
          </p>
          <p>
            True Sidereal astrology restores the original relationship between humans and the cosmos by reading the actual positions of the Sun, Moon, planets, and constellations at the moment of birth. This is not a new system — it is a return to sky-based astrology used for millennia.
          </p>
        </FAQItem>

        <FAQItem id="why-sidereal" question="Why do you use True Sidereal astrology?">
          <p>
            We use True Sidereal astrology because it reflects what was truly overhead when you were born.
          </p>
          <p>
            This is the most ancient and observational form of astrology — long before symbolic calendars existed, humans simply looked at the sky. While tropical astrology can function symbolically, True Sidereal is the foundational chart.
          </p>
        </FAQItem>

        <FAQItem id="sun-dates" question="What are the True Sidereal Sun sign dates?">
          <p>
            True Sidereal astrology honors the uneven astronomical sizes of constellations. Some signs span short time periods, while others are much longer. True Sidereal also includes Ophiuchus, the 13th constellation the Sun visibly travels through.
          </p>
          <p>
            <b>Aries</b> (Apr 21 — May 11)<br />
            <b>Taurus</b> (May 12 — Jun 18)<br />
            <b>Gemini</b> (Jun 19 — Jul 19)<br />
            <b>Cancer</b> (Jul 20 — Aug 6)<br />
            <b>Leo</b> (Aug 7 — Sep 15)<br />
            <b>Virgo</b> (Sep 16 — Nov 4)<br />
            <b>Libra</b> (Nov 5 — Nov 23)<br />
            <b>Scorpio</b> (Nov 24 — Dec 6)<br />
            <b>Ophiuchus</b> (Dec 7 — Dec 18)<br />
            <b>Sagittarius</b> (Dec 19 — Jan 20)<br />
            <b>Capricorn</b> (Jan 21 — Feb 14)<br />
            <b>Aquarius</b> (Feb 15 — Mar 9)<br />
            <b>Pisces</b> (Mar 10 — Apr 20)
          </p>
          <p><i>*Virgo spans the entire month of October*</i></p>
        </FAQItem>

        <FAQItem id="signs-different" question="Why are my signs different than what I was told before?">
          <p>
            Because mainstream astrology uses a seasonal framework that no longer matches the sky.
          </p>
          <p>
            True Sidereal corrects this by showing where the planets actually were astronomically when you were born.
          </p>
        </FAQItem>

        <FAQItem id="ophiuchus-symbol" question="What is Ophiuchus and what does the symbol look like? ⛎">
          <p>
            Ophiuchus is the 13th zodiac constellation located along the ecliptic.
          </p>
          <p>
            It expresses transformation, healing, death-rebirth cycles, and deep psychological insight.
          </p>
        </FAQItem>

      
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          CHART BASICS & INTERPRETATION
        </h2>

        <FAQItem id="important-chart" question="What are the most important things to look at in my birth chart?">
          <p>
            • North & South Nodes (karmic growth)<br />
            • Sun (identity)<br />
            • Moon (emotional body)<br />
            • Ascendant (life approach)<br />
            • Aspects<br />
            • Stelliums
          </p>
        </FAQItem>

        <FAQItem id="moon-in-sun" question="What does it mean when the Moon is in my Sun sign?">
          <p>
            It activates your core identity and emotional alignment. These are ideal days for intention-setting, self-honoring rituals, and emotional clarity.
          </p>
        </FAQItem>

        <FAQItem id="moon-in-moon" question="What does it mean when the Moon is in my Moon sign?">
          <p>
            This is your monthly emotional reset. Sensitivity increases, and self-care becomes essential for nervous system regulation.
          </p>
        </FAQItem>

        <FAQItem id="conflicting-signs" question="What if my Sun and Moon are in conflicting signs?">
          <p>
            This indicates tension between conscious goals and emotional needs. Growth comes from integrating both rather than choosing one over the other.
          </p>
        </FAQItem>

        <FAQItem id="node-vs-ascendant" question="How is the North Node different from the Ascendant?">
          <p>
            The North Node represents karmic development. The Ascendant reflects personality expression and life navigation.
          </p>
        </FAQItem>

        <FAQItem id="no-birth-time" question="What if I don't know my birth time?">
          <p>
            You can still analyze planetary signs and aspects. Houses are missing, but core chart themes remain accessible.
          </p>
        </FAQItem>

       
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          TECHNICAL QUESTIONS
        </h2>

        <FAQItem id="13-houses" question="If there's a 13th sign, why not 13 houses?">
          <p>
            Because houses represent life areas, not constellations. Scorpio and Ophiuchus share the same sky region related to transformation.
          </p>
        </FAQItem>

        <FAQItem id="oppositions" question="How do you interpret oppositions that aren't perfectly opposite?">
          <p>
            Oppositions are read between opposing constellation regions rather than strict degrees.
          </p>
        </FAQItem>

        <FAQItem id="retrograde" question="How do retrograde planets affect my chart?">
          <p>
            They express inwardly first and emphasize reflection, depth, and unconventional processing.
          </p>
        </FAQItem>

        <FAQItem id="planet-vs-ruling" question="What's the difference between a planet in a sign vs. ruling a sign?">
          <p>
            A planet in a sign adapts to that environment. A ruling planet governs that sign's expression.
          </p>
        </FAQItem>

      
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          APPLICATION & HEALING
        </h2>

        <FAQItem id="integration" question="How does True Sky Psychology integrate astrology with healing?">
          <p>
            It combines astrology with nervous system awareness, somatic practices, and Sacred Psychology principles.
          </p>
        </FAQItem>

        <FAQItem id="predict-future" question="Can astrology predict my future?">
          <p>
            Astrology shows patterns and potential, not fixed fate.
          </p>
        </FAQItem>

        <FAQItem id="reading-frequency" question="How often should I get an astrology reading?">
          <p>
            One natal reading, yearly updates, and transition-period check-ins are recommended.
          </p>
        </FAQItem>

        <FAQItem id="children-charts" question="Do you work with children's charts?">
          <p>
            Yes, focusing on temperament and support needs rather than rigid outcomes.
          </p>
        </FAQItem>

        <FAQItem id="get-started" question="How do I start working with True Sky Psychology?">
          <p>
            Begin by generating your True Sidereal chart and exploring foundational teachings and community resources.
          </p>
        </FAQItem>

      
        <h2 className="text-[26px] md:text-[30px] font-light text-center mb-8 mt-16 tracking-wide">
          PHILOSOPHICAL FOUNDATIONS
        </h2>

        <FAQItem id="as-above" question="Why emphasize 'as above, so below'?">
          <p>
            Because reality is holographic. The sky mirrors the psyche.
          </p>
        </FAQItem>

        <FAQItem id="modern-psychology" question="How does this relate to modern psychology?">
          <p>
            Sacred Psychology treats the chart as a whole-self map — conscious, unconscious, ancestral, and energetic.
          </p>
        </FAQItem>

        <FAQItem id="scientific-validity" question="Is this scientifically valid?">
          <p>
            True Sky Psychology aligns with observational astronomy, frequency research, archetypal psychology, and resonance theory.
          </p>
        </FAQItem>

      </div>
    </div>
  );
}