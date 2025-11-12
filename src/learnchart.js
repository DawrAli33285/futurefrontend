import React from 'react';

const LearnChartPage = () => {
    return (
        <div className="min-h-screen bg-white py-8 md:py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-[26px] md:text-[30px] font-normal text-center mb-8 md:mb-12 uppercase tracking-wide">
                    How to Read a Birth Chart... In Minutes!
                </h1>


                <div className="mb-8 md:mb-12">
                    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            className="w-full aspect-video"
                          src="https://www.youtube.com/embed/_wi4qBAnvIc"
                            title="How to Read a Birth Chart"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>


                <section className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">GETTING STARTED</h2>
                    <p className="text-sm md:text-base text-gray-700 mb-3">
                        Wouldn't it be great to know how to read a birth chart and quickly see the person's life path and personality?
                    </p>
                    <p className="text-sm md:text-base text-gray-700 mb-3">Here's how.</p>
                    <p className="text-sm md:text-base text-gray-700 mb-3">
                        First, you will need a birth chart. This is also known as a natal chart or simply an astrology chart.
                    </p>
                    <p className="text-sm md:text-base text-gray-700 mb-3">Let's use yours as an example.</p>
                    <p className="text-sm md:text-base text-gray-700">
                        If you don't have it available, you can use my simple and easy-to-use{' '}
                        <a href="#" className="text-indigo-600 hover:underline">birth chart calculator</a>.
                    </p>
                </section>


                <section className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">THE HOUSES</h2>
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        <div>
                            <p className="text-sm md:text-base text-gray-700 mb-3">
                                The houses represent the sky at the time of birth, divided into twelve parts. More specifically, the ecliptic, which is the path the planets move across in the sky. The houses form the skeletal structure of the chart and are always in the same location for everyone. They are numbered one through twelve.
                            </p>
                            <p className="text-sm md:text-base text-gray-700 mb-3">
                                In a western chart, like the one we are using, the beginning of the first house is the eastern horizon. This is also known as the rising sign, or the ascendant. This is the beginning of the chart and the houses start here. Beginning with the first house moving counterclockwise through the twelfth.
                            </p>
                            <p className="text-sm md:text-base text-gray-700 mb-3">
                                (Note that there are different house systems used by astrologers. The ascendant might be somewhere in the first house, or you might notice the houses aren't equal. The system we are using is the equal house system. This divides the ecliptic into twelve equal parts, starting from the ascendant. Feel free to use whichever system you prefer.)
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <img
                                src="./houses.png"
                                alt="Birth Chart Houses"
                                className="max-w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                    <p className="text-sm md:text-base text-gray-700 mt-4 mb-3">
                        Opposite the ascendant is the descendant. This is the western horizon, or what's setting. The top of the chart is the highest part of the ecliptic in the sky. The bottom of the chart is what is underneath the horizon, or the non-visible sky.
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                        Since the houses represent the areas of the sky, in astrology the houses represent the <strong>areas of life</strong>.
                    </p>
                    <p className="text-sm md:text-base text-gray-700 mt-3">
                        For example, the first house represents all areas of life associated with the self. This includes our self-image, motivations, goals, and appearance. The houses represent what we call "areas of life".
                    </p>
                </section>


                <section className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">THE SIGNS</h2>
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        <div>
                            <p className="text-sm md:text-base text-gray-700 mb-3">
                                The signs represent where along the ecliptic the zodiac signs were at the time of birth. What sign was rising, which setting? This is where interpretations can begin, now that we have two components of the chart to compare.
                            </p>
                            <p className="text-sm md:text-base text-gray-700 mb-3">
                                The signs show the characteristics of the sky at the time of birth. So an easy way of remembering what they represent is to think of them as the <strong>characteristics of life</strong>.
                            </p>
                            <p className="text-sm md:text-base text-gray-700">
                                For example, the directness and assertiveness of Aries. The zodiac signs show the qualities that come through our life.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <img
                                src="./signs.png"
                                alt="Zodiac Signs Chart"
                                className="max-w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </section>


                <section className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">THE PLANETS</h2>
                    <p className="text-sm md:text-base text-gray-700 mb-3">
                        The transient planets in the sky mirror our transient experiences on Earth. These experiences shape our personality.
                    </p>
                    <p className="text-sm md:text-base text-gray-700 mb-3">
                        The house a planet is in shows what <strong>area of life</strong> shapes our personality. The sign shows what <strong>characteristics</strong> shape our personality.
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                        The easiest way to think about planets are as the experiences of life which shape our <strong>personality</strong>.
                    </p>
                </section>


                <section className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">HOW TO READ YOUR NATAL CHART</h2>
                    <p className="text-sm md:text-base text-gray-700 mb-3">
                        In natal chart analysis, we want to start with the most fundamental elements first. In other words, the most fundamental elements of your personality.
                    </p>
                    <p className="text-sm md:text-base text-gray-700 mb-3">
                        Four main components of the chart show this. The four main components are the Sun, Moon, ascendant, and the ascendant's ruler (also known as the chart ruler).
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                        We are looking for the house and sign position of these four components. (Note that the ascendant only shows the sign).
                    </p>
                </section>


                <section className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">THE SUN AND MOON</h2>
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        <div>
                            <p className="text-sm md:text-base text-gray-700 mb-3">
                                The Sun and Moon represent the most fundamental, yang and yin, elements of the self. The Sun represents the outwardly focused, expressive, and masculine side. The Moon represents the inwardly focused, reflective, feminine side. Together these planets make up the bulk of the outer and inner personality.
                            </p>
                            <p className="text-sm md:text-base text-gray-700 mb-3">
                                Find the Sun and Moon in your chart. Write down your Sun sign and house, along with your Moon sign and house. You can use this{' '}
                                <a href="#" className="text-indigo-600 hover:underline">house-meaning PDF</a> and{' '}
                                <a href="#" className="text-indigo-600 hover:underline">sign-meaning PDF</a> to uncover these fundamental elements of your personality.
                            </p>
                            <p className="text-sm md:text-base text-gray-700">
                                Remember that the house placements show the areas of life that are important to you. The signs show the characteristics that come through your personality. Your Sun represents your <strong>outward self</strong> and Moon your <strong>inward self</strong>.
                            </p>
                        </div>
                        <div className="flex justify-center gap-4">
                         
                           <img src="./sun-moon.png"/>
                        </div>
                    </div>
                </section>


                <section className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">THE ASCENDANT AND CHART RULER</h2>
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        <div>
                            <p className="text-sm md:text-base text-gray-700 mb-3">
                                These elements show how your life unfolds. They show what shapes your personality over time. They are like your Sun and Moon, except they are more like your life path. They show the life events that shape your personality through time. You might think of them as showing who you are becoming.
                            </p>
                            <p className="text-sm md:text-base text-gray-700 mb-3">
                                Your ascendant sign shows the qualities you are developing. There is only a sign associated with it because it is always associated with the beginning of the first house. (Remember the ascendant is the line at the beginning of the first house.)
                            </p>
                            <p className="text-sm md:text-base text-gray-700">
                                Let's identify your ascendant sign. Look up the characteristics of this sign using the{' '}
                                <a href="#" className="text-indigo-600 hover:underline">sign PDF</a> we used earlier. These are the qualities that come through your life experiences and shape who you are becoming. These are very important qualities to develop in your life.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <div className="text-center">
                                <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                                  <img src="./ascendant.png"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="mb-8 md:mb-12">
                    <h3 className="text-lg md:text-xl font-semibold mb-4">IDENTIFYING THE CHART RULER</h3>
                    <p className="text-sm md:text-base text-gray-700 mb-3">
                        Your chart ruler is the planet that "rules" your ascendant sign. The house and sign of your chart ruler shows not only what characteristics you are developing, but the area of life as well. Use this{' '}
                        <a href="#" className="text-indigo-600 hover:underline">ruler PDF</a> to get a list of rulers for each of the ascendant signs.
                    </p>
                    <p className="text-sm md:text-base text-gray-700 mb-3">
                        Once you know your chart ruler planet, locate the house and sign placement the planet is in. Use the{' '}
                        <a href="#" className="text-indigo-600 hover:underline">house PDF</a> and{' '}
                        <a href="#" className="text-indigo-600 hover:underline">sign PDF</a> to identify what areas and characteristics shape your personality. The chart ruler shows <strong>who you are becoming, and through which area of life</strong>.
                    </p>
                </section>


                <section className="mb-8 md:mb-12">
    <h2 className="text-xl md:text-2xl font-semibold mb-4">TYING IT ALL TOGETHER</h2>
    <div className="grid md:grid-cols-2 gap-6 items-start">
        
        <div>
            <p className="text-sm md:text-base text-gray-700 mb-3">
                At this point, you've uncovered the four most important elements of reading a birth chart. Analyzing these four components will result in a good understanding of who you are and your life path. You can apply this same process to any person's chart.
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-3">
                If you want to take the analysis further, you can look at the associations between these four components and other planets in the chart. These associations are called aspects. The aspects are the lines in the center of the chart. Here is a PDF of what the different{' '}
                <a href="#" className="text-indigo-600 hover:underline">aspects mean</a>, for your further analysis.
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-3">
                Next, you can look at the inner planets: Mercury, Venus, and Mars. The middle planets: Jupiter and Saturn. The outer planets: Uranus and Neptune. Then Chiron and Pluto. Read their house and sign placements.
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-3">
                As you move further out to the more distant planets the personality becomes deeper and less noticeable. Much like an onion. The outer layer of our personality represents the four main components we covered. Followed by the inner planets, middle, then outer at the center of the onion.
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-3">
                Pay attention to any planets in the first house, they will come through strongly in the personality. Here is a list of the{' '}
                <a href="#" className="text-indigo-600 hover:underline">major planets</a>, it shows what elements of the self they represent.
            </p>
            <p className="text-sm md:text-base text-gray-700">
                By focusing on the four main components of the birth chart... you now know how to analyze a birth chart accurately in a matter of minutes.
            </p>
        </div>
        
       
        <div className="flex justify-center md:justify-end items-start">
            <img
                src="./astrology-chart.png"
                alt="Complete Birth Chart"
                className="max-w-full h-auto rounded-lg shadow-lg"
            />
        </div>
    </div>
    
    <p className="text-sm md:text-base text-gray-700 mt-4">
        To see our full interpretation of your natal chart get your{' '}
        <a href="#" className="text-indigo-600 hover:underline font-semibold">full report with e-reading</a>.
    </p>
</section>

<section className="mb-8 md:mb-12">
    <h2 className="text-xl md:text-2xl font-bold mb-6">VIDEO RESOURCES:</h2>
    
    <div className="grid md:grid-cols-2 gap-8 items-start">
       
        <div className="space-y-3">
            <p>
                <a 
                    href="/sidereal-birth-chart-calculator" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm md:text-base"
                >
                    Birth Chart Calculator
                </a>
            </p>
            <p>
                <a 
                    href="/sidereal-astrology" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm md:text-base"
                >
                    What is Sidereal Astrology?
                </a>
            </p>
            <p>
                <a 
                    href="/pdfs/astrology-house-meanings.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm md:text-base"
                >
                    House Meanings List
                </a>
            </p>
            <p>
                <a 
                    href="/pdfs/astrology-sign-meanings.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm md:text-base"
                >
                    Sign Meanings List
                </a>
            </p>
            <p>
                <a 
                    href="/pdfs/astrology-ruler-list.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm md:text-base"
                >
                    Ruler List
                </a>
            </p>
            <p>
                <a 
                    href="/pdfs/astrology-aspect-meanings.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm md:text-base"
                >
                    Aspect Meanings List
                </a>
            </p>
            <p>
                <a 
                    href="/pdfs/astrology-planet-meanings.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm md:text-base"
                >
                    Planet Meanings List
                </a>
            </p>
        </div>
        
       
        <div className="flex justify-center md:justify-end items-start">
            <img
                src="./how-to-read-a-birth-chart.png"
                alt="How to Read a Birth Chart"
                className="max-w-full h-auto rounded-lg shadow-lg"
            />
        </div>
    </div>
</section>


                <section className="text-center py-8 md:py-12 border-t border-gray-200">
                    <h2 className="text-xl md:text-2xl font-normal mb-4">
                        GET THE FULL INTERPRETATION OF YOUR NATAL CHART
                    </h2>
                    <a
                        href="#"
                        className="text-lg md:text-xl text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                    >
                        FULL REPORT WITH E-READING
                    </a>
                </section>
            </div>
        </div>
    );
};

export default LearnChartPage;