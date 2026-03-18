import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Learn", href: "#learn" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const LEARN_CARDS = [
  {
    icon: "🤖",
    title: "Powerful AI tools everyone should know in 2026",
    id: "ai-tools",
  },
  {
    icon: "✍️",
    title: "How to write effective prompts that actually work",
    id: "prompts",
  },
  {
    icon: "📚",
    title: "Using AI for study, assignments & research",
    id: "study",
  },
  {
    icon: "💼",
    title: "Using AI for productivity & career growth",
    id: "productivity",
  },
  {
    icon: "🎨",
    title: "Using AI for creativity and content creation",
    id: "creativity",
  },
  {
    icon: "🔴",
    title: "Real live demonstrations with practical examples",
    id: "demos",
  },
];

const WHO_CARDS = [
  { icon: "🏫", title: "Higher Secondary Students", sub: "(HSS)", id: "hss" },
  { icon: "🎓", title: "Undergraduate Students", sub: "(UG)", id: "ug" },
  { icon: "📖", title: "Postgraduate Students", sub: "(PG)", id: "pg" },
  { icon: "💡", title: "Self-learners & curious minds", sub: "", id: "self" },
];

const GAIN_CARDS = [
  { text: "Practical AI skills", id: "practical" },
  { text: "Most powerful AI tools", id: "tools" },
  { text: "Effective prompt writing", id: "prompt" },
  { text: "Real-world use cases", id: "usecases" },
  { text: "Anthropic Certification guidance", id: "cert" },
  { text: "Competitive edge in academics and career", id: "edge" },
];

const BONUS_ITEMS = [
  { text: "Guided step-by-step", id: "guided" },
  { text: "Completely free", id: "free" },
  { text: "Certificate by Anthropic", id: "certificate" },
  { text: "Add to resume & LinkedIn", id: "linkedin" },
];

const FAQS = [
  {
    id: "technical",
    q: "Do I need any technical or coding knowledge?",
    a: "Absolutely not! This bootcamp is built for beginners. If you can use a smartphone, you're ready to join.",
  },
  {
    id: "attend",
    q: "How will I attend the session?",
    a: "The session will be conducted live on Google Meet. The link will be sent to you on WhatsApp after registration.",
  },
  {
    id: "anthropic",
    q: "What is the Anthropic AI Certification?",
    a: "It's a free, globally recognized AI certification issued by Anthropic — the creators of Claude AI. We will guide every participant through the process step-by-step.",
  },
  {
    id: "price",
    q: "Is ₹99 the final price? Any hidden charges?",
    a: "₹99 is all-inclusive. There are absolutely no hidden fees or additional charges.",
  },
  {
    id: "recording",
    q: "Will there be a recording?",
    a: "The bootcamp is designed to be live and hands-on for maximum learning impact. We strongly recommend attending live.",
  },
  {
    id: "payment",
    q: "How do I pay?",
    a: "Payment details including UPI/QR code will be shared after you submit the registration form. You can also contact us directly on WhatsApp.",
  },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl md:text-4xl font-extrabold text-wyde-text mb-2 font-display">
      {children}
    </h2>
  );
}

function GreenDivider() {
  return (
    <div
      className="w-16 h-1 rounded-full mb-8"
      style={{ background: "#00e676" }}
    />
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Sticky Navbar */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(6, 20, 13, 0.92)",
          borderBottom: "1px solid rgba(0,230,118,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
            <span
              className="text-xl font-extrabold font-display"
              style={{ color: "#00e676" }}
            >
              Wyde Edu
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-wyde-muted hover:text-neon transition-colors"
                data-ocid="nav.link"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <Link to="/register" data-ocid="nav.primary_button">
            <button
              type="button"
              className="glow-btn px-5 py-2 text-sm font-bold hidden md:block"
            >
              Register Now
            </button>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden text-wyde-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <title>Menu</title>
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-3"
            style={{ borderTop: "1px solid rgba(0,230,118,0.15)" }}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-wyde-muted hover:text-neon py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <button
                type="button"
                className="glow-btn px-5 py-2 text-sm font-bold w-full"
              >
                Register Now
              </button>
            </Link>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#00e676" }}
            >
              Wyde Edu — Educate. Empower. Evolve.
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-display leading-tight text-wyde-text mb-4">
              <span style={{ color: "#00e676" }}>AI Tools</span> &amp; Prompt
              <br />
              Engineering Bootcamp
            </h1>
            <p className="text-lg md:text-xl text-wyde-muted mb-8 max-w-2xl mx-auto">
              Learn to Use AI Like a Pro — In Just 2 Hours
            </p>

            {/* Info Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: "📅", text: "28 March 2026, Saturday", id: "date" },
                { icon: "⏰", text: "10:00 AM", id: "time" },
                { icon: "🔗", text: "Live via Google Meet", id: "platform" },
                { icon: "⏱️", text: "2 Hours Only", id: "duration" },
              ].map((b) => (
                <span
                  key={b.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    background: "rgba(0,230,118,0.08)",
                    border: "1px solid rgba(0,230,118,0.4)",
                    color: "#EAF5EE",
                  }}
                >
                  {b.icon} {b.text}
                </span>
              ))}
            </div>

            {/* Offer Badge */}
            <div
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full mb-8"
              style={{
                background: "rgba(0,230,118,0.12)",
                border: "1px solid rgba(0,230,118,0.5)",
              }}
            >
              <span className="text-wyde-muted line-through text-sm">₹499</span>
              <span
                className="text-2xl font-black"
                style={{ color: "#00e676" }}
              >
                Just ₹99
              </span>
              <span className="text-xs font-semibold text-wyde-muted">
                Special Launch Offer
              </span>
            </div>

            <div className="flex justify-center">
              <Link to="/register" data-ocid="hero.primary_button">
                <button
                  type="button"
                  className="glow-btn px-8 py-4 text-lg font-black animate-glow-pulse"
                >
                  👉 Register Now — Only ₹99
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative glow orb */}
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,230,118,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading>Why This Bootcamp?</SectionHeading>
            <GreenDivider />
            <div className="glass-card p-6 md:p-8">
              <p className="text-wyde-muted text-base md:text-lg leading-relaxed">
                AI is no longer the future — it's the present. Students who know
                how to use AI tools and write effective prompts have a massive
                advantage in studies, jobs, and creativity. Wyde Edu brings you
                a focused 2-hour bootcamp that gives you everything you need to
                get started — no coding, no technical background, just practical
                skills you can use from day one.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section id="learn" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading>What You'll Learn</SectionHeading>
            <GreenDivider />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LEARN_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card p-5 flex gap-4 items-start"
                data-ocid={`learn.item.${i + 1}`}
              >
                <span className="text-3xl shrink-0">{card.icon}</span>
                <p className="text-wyde-text font-medium text-sm leading-relaxed">
                  {card.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading>Perfect For Students</SectionHeading>
            <GreenDivider />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {WHO_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="glass-card p-5 text-center"
                data-ocid={`audience.item.${i + 1}`}
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <p className="text-wyde-text font-semibold text-sm">
                  {card.title}
                </p>
                {card.sub && (
                  <p className="text-wyde-muted text-xs mt-1">{card.sub}</p>
                )}
              </motion.div>
            ))}
          </div>
          <div
            className="text-center py-3 px-4 rounded-xl text-sm font-semibold"
            style={{
              background: "rgba(0,230,118,0.1)",
              border: "1px solid rgba(0,230,118,0.3)",
              color: "#EAF5EE",
            }}
          >
            ✅ No technical background required — anyone can join!
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <SectionHeading>Special Launch Offer</SectionHeading>
            <GreenDivider />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 text-center"
            style={{
              boxShadow:
                "0 0 30px rgba(0,230,118,0.12), 0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            <p className="text-wyde-muted text-sm mb-2">
              AI Tools & Prompt Engineering Bootcamp
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-wyde-muted line-through text-2xl">
                ₹499
              </span>
              <span
                className="text-6xl font-black"
                style={{ color: "#00e676" }}
              >
                ₹99
              </span>
            </div>
            <p className="text-wyde-muted text-sm mb-6">
              ⚡ Limited seats available — grab yours before it's gone!
            </p>
            <Link to="/register" data-ocid="pricing.primary_button">
              <button
                type="button"
                className="glow-btn px-8 py-4 text-base font-black w-full"
              >
                Secure My Seat Now →
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BONUS */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading>🎁 Bonus Opportunity</SectionHeading>
            <GreenDivider />
            <div className="glass-card p-6 md:p-8">
              <p className="text-wyde-muted mb-6 leading-relaxed">
                As a bonus, every participant will receive guided assistance to
                earn the{" "}
                <strong className="text-wyde-text">
                  Anthropic AI Learning Certification
                </strong>{" "}
                — a globally recognized certificate issued directly by Anthropic
                (the creators of Claude AI). It's completely free, can be added
                to your resume and LinkedIn, and gives you a powerful edge in
                academics and career.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BONUS_ITEMS.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="text-lg" style={{ color: "#00e676" }}>
                      ✅
                    </span>
                    <span className="text-wyde-text font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT YOU GAIN */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading>What You Walk Away With</SectionHeading>
            <GreenDivider />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAIN_CARDS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="glass-card p-5 flex items-center gap-3"
                data-ocid={`gain.item.${i + 1}`}
              >
                <span className="text-xl" style={{ color: "#00e676" }}>
                  ✅
                </span>
                <span className="text-wyde-text font-semibold">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRATION CTA */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 md:p-10"
            style={{ boxShadow: "0 0 40px rgba(0,230,118,0.1)" }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-wyde-text mb-3">
              Register Now — Only ₹99
            </h2>
            <p className="text-wyde-muted text-sm mb-6">
              Fill in your details to reserve your seat. Our team will contact
              you on WhatsApp with payment and joining details.
            </p>
            <Link to="/register" data-ocid="cta.primary_button">
              <button
                type="button"
                className="glow-btn px-8 py-4 text-base font-black w-full mb-5"
              >
                👉 Register Now — Only ₹99
              </button>
            </Link>
            <p className="text-wyde-muted text-sm">
              📞 Prefer to register via call? Contact us:
              <br />
              <a href="tel:+919539929373" className="text-neon hover:underline">
                +91 95399 29373
              </a>
              ,{" "}
              <a href="tel:+918606686014" className="text-neon hover:underline">
                +91 86066 86014
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading>Got Questions? We've Got Answers.</SectionHeading>
            <GreenDivider />
          </motion.div>
          <div className="glass-card overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.id}
                  value={`faq-${faq.id}`}
                  style={{
                    borderBottom:
                      i < FAQS.length - 1
                        ? "1px solid rgba(0,230,118,0.15)"
                        : "none",
                  }}
                  data-ocid={`faq.item.${i + 1}`}
                >
                  <AccordionTrigger
                    className="px-6 py-4 text-left font-semibold hover:no-underline hover:text-neon transition-colors"
                    style={{ color: "#EAF5EE" }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-wyde-muted leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-10 px-4 mt-8"
        style={{
          borderTop: "1px solid rgba(0,230,118,0.15)",
          background: "rgba(6,20,13,0.8)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-2xl font-extrabold font-display mb-1"
            style={{ color: "#00e676" }}
          >
            Wyde Edu
          </p>
          <p className="text-wyde-muted text-sm mb-4">
            Educate. Empower. Evolve.
          </p>
          <p className="text-wyde-muted text-sm mb-3">
            AI Tools & Prompt Engineering Bootcamp | 28 March 2026
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm text-wyde-muted mb-6">
            <span>
              📞{" "}
              <a
                href="tel:+919539929373"
                className="hover:text-neon transition-colors"
              >
                +91 95399 29373
              </a>
            </span>
            <span>📍 Online — Google Meet</span>
          </div>
          <p className="text-wyde-muted text-xs">
            © 2026 Wyde Edu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
