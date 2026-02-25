import { useState } from "react";
import { Mail, Star, BarChart2, Zap, ChevronDown, ChevronUp } from "lucide-react";

const DAYS = [
  {
    label: "Sunday", date: "11/9/2025",
    transits: [
      { transit: "Sun", aspect: "Trine", natal: "Jupiter", strength: "Weak", orb: "7.73°", msg: "Harmonious energy flow. Things come easily and naturally today." },
      { transit: "Moon", aspect: "Trine", natal: "Sun", strength: "Moderate", orb: "5.35°", msg: "Emotional harmony and comfort. A nurturing day for relationships." },
      { transit: "Mercury", aspect: "Conjunction", natal: "Mars", strength: "Strong", orb: "2.46°", msg: "Mental clarity and communication focus. Share your ideas confidently." },
      { transit: "Venus", aspect: "Square", natal: "Moon", strength: "Weak", orb: "6.00°", msg: "Relationship tension or financial strain. Avoid impulsive decisions." },
      { transit: "Jupiter", aspect: "Trine", natal: "Saturn", strength: "Exact", orb: "0.27°", msg: "Luck and growth come easily. Your optimism attracts good fortune." },
      { transit: "Saturn", aspect: "Trine", natal: "Moon", strength: "Very Strong", orb: "1.91°", msg: "Discipline pays off. Hard work brings lasting results." },
    ],
    summary: {
      exact: ["Jupiter Trine Saturn (0.27°)", "Saturn Trine Jupiter (0.28°)"],
      strong: ["Saturn Trine Moon (1.91°)"],
      supporting: ["Mercury Conjunction Mars (2.46°)", "Mars Conjunction Mercury (3.15°)", "Jupiter Conjunction Moon (2.19°)"],
    },
  },
  {
    label: "Monday", date: "11/10/2025",
    transits: [
      { transit: "Sun", aspect: "Trine", natal: "Jupiter", strength: "Weak", orb: "6.69°", msg: "Harmonious energy flow. Things come easily and naturally today." },
      { transit: "Moon", aspect: "Conjunction", natal: "Jupiter", strength: "Strong", orb: "2.19°", msg: "Emotional intensity and heightened intuition. Trust your feelings." },
      { transit: "Moon", aspect: "Trine", natal: "Saturn", strength: "Very Strong", orb: "1.92°", msg: "Emotional harmony and comfort. A nurturing day for relationships." },
      { transit: "Mercury", aspect: "Conjunction", natal: "Mars", strength: "Strong", orb: "2.43°", msg: "Mental clarity and communication focus. Share your ideas confidently." },
      { transit: "Jupiter", aspect: "Trine", natal: "Saturn", strength: "Exact", orb: "0.27°", msg: "Luck and growth come easily. Your optimism attracts good fortune." },
      { transit: "Saturn", aspect: "Trine", natal: "Moon", strength: "Very Strong", orb: "1.92°", msg: "Discipline pays off. Hard work brings lasting results." },
    ],
    summary: {
      exact: ["Jupiter Trine Saturn (0.27°)", "Saturn Trine Jupiter (0.27°)"],
      strong: ["Moon Trine Saturn (1.92°)", "Saturn Trine Moon (1.92°)"],
      supporting: ["Moon Conjunction Jupiter (2.19°)", "Mercury Conjunction Mars (2.43°)", "Jupiter Conjunction Moon (2.19°)"],
    },
  },
  {
    label: "Tuesday", date: "11/11/2025",
    transits: [
      { transit: "Sun", aspect: "Trine", natal: "Jupiter", strength: "Moderate", orb: "5.65°", msg: "Harmonious energy flow. Things come easily and naturally today." },
      { transit: "Moon", aspect: "Trine", natal: "Mercury", strength: "Moderate", orb: "4.17°", msg: "Emotional harmony and comfort. A nurturing day for relationships." },
      { transit: "Moon", aspect: "Square", natal: "Venus", strength: "Weak", orb: "6.44°", msg: "Emotional tension or restlessness. Take time to process inner needs." },
      { transit: "Mars", aspect: "Conjunction", natal: "Mercury", strength: "Very Strong", orb: "1.72°", msg: "High energy and assertiveness. Take bold action but avoid aggression." },
      { transit: "Jupiter", aspect: "Trine", natal: "Saturn", strength: "Exact", orb: "0.27°", msg: "Luck and growth come easily. Your optimism attracts good fortune." },
      { transit: "Saturn", aspect: "Trine", natal: "Moon", strength: "Very Strong", orb: "1.92°", msg: "Discipline pays off. Hard work brings lasting results." },
    ],
    summary: {
      exact: ["Jupiter Trine Saturn (0.27°)", "Saturn Trine Jupiter (0.27°)"],
      strong: ["Mars Conjunction Mercury (1.72°)", "Saturn Trine Moon (1.92°)"],
      supporting: ["Mercury Conjunction Mars (2.26°)", "Jupiter Conjunction Moon (2.19°)"],
    },
  },
  {
    label: "Wednesday", date: "11/12/2025",
    transits: [
      { transit: "Sun", aspect: "Trine", natal: "Jupiter", strength: "Moderate", orb: "4.62°", msg: "Harmonious energy flow. Things come easily and naturally today." },
      { transit: "Moon", aspect: "Square", natal: "Sun", strength: "Moderate", orb: "5.99°", msg: "Emotional tension or restlessness. Take time to process inner needs." },
      { transit: "Mercury", aspect: "Conjunction", natal: "Mars", strength: "Very Strong", orb: "1.81°", msg: "Mental clarity and communication focus. Share your ideas confidently." },
      { transit: "Mars", aspect: "Conjunction", natal: "Mercury", strength: "Very Strong", orb: "1.01°", msg: "High energy and assertiveness. Take bold action but avoid aggression." },
      { transit: "Jupiter", aspect: "Trine", natal: "Saturn", strength: "Exact", orb: "0.28°", msg: "Luck and growth come easily. Your optimism attracts good fortune." },
      { transit: "Saturn", aspect: "Trine", natal: "Moon", strength: "Very Strong", orb: "1.92°", msg: "Discipline pays off. Hard work brings lasting results." },
    ],
    summary: {
      exact: ["Jupiter Trine Saturn (0.28°)", "Saturn Trine Jupiter (0.27°)"],
      strong: ["Mercury Conjunction Mars (1.81°)", "Mars Conjunction Mercury (1.01°)", "Saturn Trine Moon (1.92°)"],
      supporting: ["Jupiter Conjunction Moon (2.19°)"],
    },
  },
  {
    label: "Thursday", date: "11/13/2025",
    transits: [
      { transit: "Sun", aspect: "Trine", natal: "Jupiter", strength: "Strong", orb: "3.72°", msg: "Harmonious energy flow. Things come easily and naturally today." },
      { transit: "Moon", aspect: "Square", natal: "Mercury", strength: "Very Strong", orb: "0.53°", msg: "Emotional tension or restlessness. Take time to process inner needs." },
      { transit: "Moon", aspect: "Sextile", natal: "Venus", strength: "Strong", orb: "2.80°", msg: "Emotional clarity and social ease. Express your feelings openly." },
      { transit: "Mercury", aspect: "Conjunction", natal: "Mars", strength: "Very Strong", orb: "1.34°", msg: "Mental clarity and communication focus. Share your ideas confidently." },
      { transit: "Mars", aspect: "Conjunction", natal: "Mercury", strength: "Very Strong", orb: "0.30°", msg: "High energy and assertiveness. Take bold action but avoid aggression." },
      { transit: "Jupiter", aspect: "Trine", natal: "Saturn", strength: "Exact", orb: "0.28°", msg: "Luck and growth come easily. Your optimism attracts good fortune." },
    ],
    summary: {
      exact: ["Moon Square Mercury (0.53°)", "Mars Conjunction Mercury (0.30°)", "Jupiter Trine Saturn (0.28°)", "Saturn Trine Jupiter (0.27°)"],
      strong: ["Mercury Conjunction Mars (1.34°)", "Saturn Trine Moon (1.92°)"],
      supporting: ["Sun Trine Jupiter (3.72°)", "Moon Sextile Venus (2.80°)", "Jupiter Conjunction Moon (2.19°)"],
    },
  },
  {
    label: "Friday", date: "11/14/2025",
    transits: [
      { transit: "Sun", aspect: "Trine", natal: "Jupiter", strength: "Strong", orb: "2.69°", msg: "Harmonious energy flow. Things come easily and naturally today." },
      { transit: "Moon", aspect: "Sextile", natal: "Sun", strength: "Very Strong", orb: "1.51°", msg: "Emotional clarity and social ease. Express your feelings openly." },
      { transit: "Mercury", aspect: "Conjunction", natal: "Mars", strength: "Very Strong", orb: "0.59°", msg: "Mental clarity and communication focus. Share your ideas confidently." },
      { transit: "Mars", aspect: "Conjunction", natal: "Mercury", strength: "Very Strong", orb: "0.41°", msg: "High energy and assertiveness. Take bold action but avoid aggression." },
      { transit: "Jupiter", aspect: "Trine", natal: "Saturn", strength: "Exact", orb: "0.28°", msg: "Luck and growth come easily. Your optimism attracts good fortune." },
      { transit: "Saturn", aspect: "Trine", natal: "Moon", strength: "Very Strong", orb: "1.93°", msg: "Discipline pays off. Hard work brings lasting results." },
    ],
    summary: {
      exact: ["Mercury Conjunction Mars (0.59°)", "Mars Conjunction Mercury (0.41°)", "Jupiter Trine Saturn (0.28°)", "Saturn Trine Jupiter (0.26°)"],
      strong: ["Moon Sextile Sun (1.51°)", "Mercury Conjunction Mars (0.59°)", "Saturn Trine Moon (1.93°)"],
      supporting: ["Sun Trine Jupiter (2.69°)", "Jupiter Conjunction Moon (2.19°)"],
    },
  },
  {
    label: "Saturday", date: "11/15/2025",
    transits: [
      { transit: "Sun", aspect: "Trine", natal: "Jupiter", strength: "Very Strong", orb: "1.66°", msg: "Harmonious energy flow. Things come easily and naturally today." },
      { transit: "Moon", aspect: "Sextile", natal: "Mars", strength: "Strong", orb: "2.08°", msg: "Emotional clarity and social ease. Express your feelings openly." },
      { transit: "Mercury", aspect: "Conjunction", natal: "Mars", strength: "Exact", orb: "0.18°", msg: "Mental clarity and communication focus. Share your ideas confidently." },
      { transit: "Venus", aspect: "Conjunction", natal: "Sun", strength: "Weak", orb: "7.63°", msg: "Love, beauty, and pleasure are emphasized. Enjoy life's sweetness." },
      { transit: "Mars", aspect: "Conjunction", natal: "Mercury", strength: "Very Strong", orb: "1.11°", msg: "High energy and assertiveness. Take bold action but avoid aggression." },
      { transit: "Jupiter", aspect: "Trine", natal: "Saturn", strength: "Exact", orb: "0.28°", msg: "Luck and growth come easily. Your optimism attracts good fortune." },
    ],
    summary: {
      exact: ["Mercury Conjunction Mars (0.18°)", "Jupiter Trine Saturn (0.28°)", "Saturn Trine Jupiter (0.12°)"],
      strong: ["Sun Trine Jupiter (1.66°)", "Sun Trine Saturn (1.93°)", "Mars Conjunction Mercury (1.11°)"],
      supporting: ["Sun Trine Moon (3.85°)", "Moon Sextile Mars (2.08°)", "Jupiter Conjunction Moon (2.19°)", "Saturn Trine Moon (2.07°)"],
    },
  },
];

const strengthStyle = (s) => {
  if (s === "Exact") return "bg-amber-100 text-amber-800 border border-amber-300";
  if (s === "Very Strong") return "bg-indigo-100 text-indigo-800 border border-indigo-200";
  if (s === "Strong") return "bg-violet-100 text-violet-800 border border-violet-200";
  if (s === "Moderate") return "bg-sky-100 text-sky-700 border border-sky-200";
  return "bg-gray-100 text-gray-400 border border-gray-200";
};

const aspectStyle = (a) => {
  if (a === "Conjunction") return "text-amber-600 font-semibold";
  if (a === "Trine") return "text-emerald-600 font-semibold";
  if (a === "Sextile") return "text-sky-600 font-semibold";
  if (a === "Square") return "text-rose-600 font-semibold";
  if (a === "Opposition") return "text-orange-600 font-semibold";
  return "text-gray-600 font-semibold";
};

function DayPanel({ day, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const [tab, setTab] = useState("transits");

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 w-20 text-left">{day.label}</span>
          <span className="text-sm text-gray-400">{day.date}</span>
          {day.summary.exact.length > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              🔥 {day.summary.exact.length} Exact
            </span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100">
          <div className="flex border-b border-gray-100 bg-gray-50">
            {["transits", "summary"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                  tab === t ? "border-b-2 border-indigo-500 text-indigo-600 bg-white" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "transits" ? "📅 Daily Transits" : "📋 Day Summary"}
              </button>
            ))}
          </div>

          {tab === "transits" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
                    <th className="text-left px-4 py-3 font-semibold">Transit</th>
                    <th className="text-left px-4 py-3 font-semibold">Aspect</th>
                    <th className="text-left px-4 py-3 font-semibold">Natal</th>
                    <th className="text-left px-4 py-3 font-semibold">Strength</th>
                    <th className="text-left px-4 py-3 font-semibold">Orb</th>
                    <th className="text-left px-4 py-3 font-semibold">Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  {day.transits.map((t, i) => (
                    <tr key={i} className="border-t border-gray-50 hover:bg-indigo-50/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-800">{t.transit}</td>
                      <td className={`px-4 py-3 ${aspectStyle(t.aspect)}`}>{t.aspect}</td>
                      <td className="px-4 py-3 text-gray-700">{t.natal}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${strengthStyle(t.strength)}`}>{t.strength}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{t.orb}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed max-w-xs">💫 {t.msg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "summary" && (
            <div className="p-5 space-y-5">
              {day.summary.exact.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">🔥 Exact Aspects — Major Energy</p>
                  <div className="space-y-1">
                    {day.summary.exact.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{e} — <span className="text-gray-400 text-xs">High impact. Powerful day for action.</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {day.summary.strong.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">⚡ Strong Influences</p>
                  <div className="space-y-1">
                    {day.summary.strong.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {day.summary.supporting.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">💫 Supporting Energies</p>
                  <div className="space-y-1">
                    {day.summary.supporting.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="text-gray-300 mt-0.5">•</span>
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function NatalWeeklyReportPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">

        {/* ── Hero ── */}
        <h1 className="text-[26px] md:text-[32px] font-light text-center mb-6 uppercase tracking-wide">
          Natal Weekly Report
        </h1>
        <div className="border-t border-gray-300 mb-8" />
        <p className="text-center text-gray-500 italic mb-10 max-w-2xl mx-auto">
          "Astrology is most powerful when it meets you exactly where you are — every single week." — Athen Chimenti
        </p>
        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-14 leading-relaxed">
          The Natal Weekly Report is a personalized weekly email written specifically for your true sidereal natal chart.
          Each report translates the current sky into language that is meaningful and actionable for <em>you</em> — not
          generic horoscope content, but real insights tied directly to your planetary positions, delivered every week.
        </p>

        {/* ── Features ── */}
        <h2 className="text-xl font-light text-center uppercase tracking-wide mb-8">What Each Weekly Email Includes</h2>
        <div className="border-t border-gray-300 mb-10" />
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {[
            { icon: <Star size={18} />, title: "Weekly Planetary Transits — Personalized to You", body: "See exactly how the current planetary movements are activating your natal chart and what themes to expect each day of the week." },
            { icon: <Zap size={18} />, title: "Retrogrades, Eclipses & Key Cosmic Events", body: "Never be caught off guard. Each report highlights major astrological events and explains how they affect your chart specifically." },
            { icon: <BarChart2 size={18} />, title: "Monthly Forecasts & Predictions", body: "Delivered at the start of each month, your forecast gives you a broader view so you can plan the weeks ahead with intention." },
            { icon: <Mail size={18} />, title: "Personalized Guidance & Affirmations", body: "Each report closes with a personalized reflection tied to your chart, helping you integrate the week's energy consciously." },
          ].map((f, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="text-indigo-500 mt-1 flex-shrink-0">{f.icon}</div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">{f.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Sample Report Preview ── */}
        <h2 className="text-xl font-light text-center uppercase tracking-wide mb-3">Sample Weekly Report</h2>
        <p className="text-center text-gray-500 text-sm mb-8 max-w-xl mx-auto">
          This is exactly what subscribers receive in their inbox each week — personalized to their own natal chart.
        </p>
        <div className="border-t border-gray-300 mb-8" />

        <div className="max-w-5xl mx-auto border border-gray-200 rounded-2xl overflow-hidden shadow-lg mb-20">

          {/* Report header */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 px-6 py-8 text-white text-center">
            <p className="text-xs uppercase tracking-widest text-indigo-300 mb-2">True Sidereal Astrology</p>
            <h3 className="text-2xl font-light tracking-wide mb-1">🌟 Your Natal Weekly Report</h3>
            <p className="text-indigo-200 text-sm">Week of November 9 – 15, 2025</p>
          </div>

          {/* Chart wheel placeholder */}
          <div className="bg-indigo-50 border-b border-gray-100 px-6 py-8 flex flex-col items-center gap-3">
            <div className="w-40 h-40 rounded-full border-4 border-indigo-200 flex items-center justify-center bg-white shadow-inner">
              <div className="w-28 h-28 rounded-full border-2 border-indigo-100 flex items-center justify-center">
                <span className="text-4xl">⭐</span>
              </div>
            </div>
            <p className="text-indigo-400 text-xs uppercase tracking-widest">Your Natal Chart Wheel</p>
          </div>

          {/* Daily breakdown */}
          <div className="px-4 md:px-6 py-8 bg-gray-50">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">📅 Daily Transit Breakdown</p>
            <div className="space-y-3">
              {DAYS.map((day, i) => (
                <DayPanel key={day.label} day={day} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        </div>

        {/* ── How It Works ── */}
        <h2 className="text-xl font-light text-center uppercase tracking-wide mb-8">How It Works</h2>
        <div className="border-t border-gray-300 mb-10" />
        <div className="max-w-2xl mx-auto mb-16 space-y-4 text-gray-700">
          <p><span className="font-semibold">1.</span> Sign up and enter your birth details (date, time, and location).</p>
          <p><span className="font-semibold">2.</span> Athen configures your personalized report using your true sidereal natal chart.</p>
          <p><span className="font-semibold">3.</span> Every week, your Natal Weekly Report arrives directly in your inbox.</p>
          <p><span className="font-semibold">4.</span> Cancel anytime. No contracts, no commitments.</p>
        </div>

        {/* ── Pricing ── */}
        <div className="border-t border-gray-300 mb-12" />
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">

          <div className="border border-gray-200 rounded-xl shadow-sm p-8 text-center">
            <p className="uppercase tracking-widest text-xs text-indigo-400 font-semibold mb-2">Natal Weekly Report</p>
            <p className="text-4xl font-light text-gray-900 mb-1">$XX<span className="text-lg text-gray-400">/mo</span></p>
            <p className="text-gray-400 text-xs mb-6">Billed monthly · Cancel anytime</p>
            <ul className="text-gray-600 text-sm space-y-2 mb-8 text-left">
              <li>✓ Weekly personalized transit email</li>
              <li>✓ Monthly forecast in your inbox</li>
              <li>✓ Retrograde &amp; eclipse alerts</li>
              <li>✓ Personalized weekly affirmations</li>
            </ul>
            <a href="/login" className="block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded transition-colors text-sm">
              Sign Up → Login &amp; Subscribe
            </a>
          </div>

          <div className="border-2 border-indigo-500 rounded-xl shadow-lg p-8 text-center relative">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
              Best Value
            </span>
            <p className="uppercase tracking-widest text-xs text-indigo-500 font-semibold mb-2">Chart Generator + Weekly Report</p>
            <p className="text-4xl font-light text-gray-900 mb-1">$15<span className="text-lg text-gray-400">/mo</span></p>
            <p className="text-gray-400 text-xs mb-6">Billed monthly · Cancel anytime</p>
            <ul className="text-gray-600 text-sm space-y-2 mb-8 text-left">
              <li>✓ Full access to True Sky chart generator</li>
              <li>✓ Generate true sidereal natal charts instantly</li>
              <li>✓ <strong className="text-gray-800">Natal Weekly Report included</strong></li>
              <li>✓ Monthly forecast in your inbox</li>
              <li>✓ Retrograde &amp; eclipse alerts</li>
              <li>✓ Personalized weekly affirmations</li>
            </ul>
            <a href="/login" className="block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded transition-colors text-sm">
              Sign Up → Login &amp; Subscribe
            </a>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mb-16">
          Already subscribed to the chart generator? The Natal Weekly Report is included —{" "}
          <a href="/login" className="text-indigo-500 hover:underline">log in to confirm</a>.
        </p>

        <div className="border-t border-gray-300 mb-10" />
        <p className="text-center text-gray-600">
          Have questions?{" "}
          <a href="#contact" className="text-indigo-600 hover:underline">Contact Athen</a>
        </p>
      </div>
    </div>
  );
}