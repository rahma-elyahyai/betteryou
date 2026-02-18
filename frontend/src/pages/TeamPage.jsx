import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowLeft, Linkedin, Star } from 'lucide-react';
import logo from '@/assets/logo.png';

import soukaina from '@/assets/personel/soukaina.png';
import rahma    from '@/assets/personel/rahma.png';
import manar    from '@/assets/personel/manar.png';
import sara     from '@/assets/personel/sara.png';
import khadija  from '@/assets/personel/khadija.png';

// ─────────────────────────────────────────────────────────────────────────────
// Team data — adjust roles & descriptions to your liking after preview
// ─────────────────────────────────────────────────────────────────────────────
const team = [
  {
    name: 'Soukaina ELOUANSAIDI',
    role: 'Frontend Developer',
    description:
      'Collaboration Reveals Who You Really Are Working with others is one of the most honest mirrors youll ever face. In a team, you cant hide your weaknesses for long, but more importantly, you discover strengths you didnt know you had. The way you handle pressure, support a struggling teammate, or step up when no one asks you to — these moments define you far more than any individual achievement ever could.',
    image: soukaina,
    linkedin: 'https://www.linkedin.com/in/soukaina-elouansaidi-65b104256/',
    color: '#818cf8',
    glow:  'rgba(129,140,248,0.35)',
    gradRaw: 'linear-gradient(135deg,#6366f1,#a855f7)',
  },
  {
    name: 'Rahma ELYAHYAI',
    role: 'Full‑Stack Engineer',
    description:
      ' The Best Work Comes From Psychological Safety People do their best work when theyre not afraid to be wrong. A team where everyone feels free to speak up, propose a crazy idea, or admit confusion is a team that moves faster and thinks deeper. The greatest thing you can build together isnt a product — its an environment where honesty is welcomed and mistakes are treated as lessons, not failures.',
    image: rahma,
    linkedin: 'https://www.linkedin.com/in/el-yahyai-rahma-46800a293?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    color: '#f472b6',
    glow:  'rgba(244,114,182,0.35)',
    gradRaw: 'linear-gradient(135deg,#ec4899,#f43f5e)',
  },
  {
    name: 'Manar OUAHABI',
    role: 'UI / UX Designer',
    description:
      'Showing Up Consistently Is Underrated Talent gets a lot of attention, but reliability is what actually builds trust. Being the person who always delivers, always communicates, always follows through — that is rarer and more valuable than being the most brilliant person in the room. What we take from working in a team is the understanding that showing up, every single day, is itself a form of excellence.',
    image: manar,
    linkedin: 'https://www.linkedin.com/in/manar-ouahabi-150673297?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    color: '#34d399',
    glow:  'rgba(52,211,153,0.35)',
    gradRaw: 'linear-gradient(135deg,#10b981,#06b6d4)',
  },
  {
    name: 'Sara LAAROUSSI',
    role: 'Backend Developer',
    description:
      'You Learn More From Your Teammates Than From Any Course No classroom, tutorial, or book taught us what working alongside driven, passionate people did. Watching how someone approaches a problem differently than you would, seeing how a teammate handles stress with grace, or simply absorbing the work ethic of someone who genuinely cares — these are lessons that stay with you for life. A good team is the best education you can get.',
    image: sara,
    linkedin: 'https://www.linkedin.com/in/sara-laaroussi-541b04331',
    color: '#fbbf24',
    glow:  'rgba(251,191,36,0.35)',
    gradRaw: 'linear-gradient(135deg,#f59e0b,#f97316)',
  },
  {
    name: 'Khadija OUASSI',
    role: 'AI & Data Engineer',
    description:
      'The Work Matters Less Than the People You Do It With Years from now, we wont remember every detail of what we built. But we will remember the people who stayed late, the ones who made us laugh during hard moments, and those who believed in the project even when it was difficult. Work gives us purpose, but its the human connections formed along the way that give it meaning. That is the real thing we carry with us long after the project ends.',
    image: khadija,
    linkedin: '#',
    color: '#c4b5fd',
    glow:  'rgba(196,181,253,0.35)',
    gradRaw: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Member card
// ─────────────────────────────────────────────────────────────────────────────
function MemberCard({ member, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0) scale(1)';
    }, 120 * index);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: 0,
        transform: 'translateY(40px) scale(0.96)',
        transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)',
      }}
      className="relative flex flex-col h-full"
    >
      {/* Glow blob */}
      <div
        style={{
          background: member.glow,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1.15)' : 'scale(0.85)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}
        className="absolute inset-0 rounded-3xl blur-2xl pointer-events-none"
      />

      {/* Glass panel */}
      <div
        style={{
          background: 'rgba(255,255,255,0.035)',
          border: `1px solid ${hovered ? member.color + '55' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: hovered
            ? `0 0 0 1px ${member.color}20, 0 32px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.09)`
            : '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
          transition: 'border-color 0.4s, box-shadow 0.4s',
        }}
        className="relative flex flex-col h-full rounded-3xl backdrop-blur-2xl overflow-hidden"
      >
        {/* Top accent bar */}
        <div
          style={{
            background: member.gradRaw,
            height: hovered ? '3px' : '2px',
            transition: 'height 0.3s',
          }}
        />

        {/* Avatar */}
        <div className="relative flex justify-center pt-10 pb-5">
          {/* Ring glow */}
          <div
            style={{
              background: member.gradRaw,
              opacity: hovered ? 0.55 : 0.18,
              transition: 'opacity 0.4s',
            }}
            className="absolute w-28 h-28 rounded-full blur-xl top-6"
          />
          {/* Gradient ring */}
          <div style={{ background: member.gradRaw, padding: '3px' }} className="relative rounded-full z-10">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#0d0d1a]">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  style={{ filter: hovered ? 'brightness(1.1)' : 'brightness(0.9)', transition: 'filter 0.4s' }}
                />
              ) : (
                <div
                  style={{ background: member.gradRaw }}
                  className="w-full h-full flex items-center justify-center text-white text-3xl font-black"
                >
                  {member.name[0]}
                </div>
              )}
            </div>
          </div>

          {/* Star badge */}
          <div
            style={{ background: member.gradRaw }}
            className="absolute z-20 bottom-4 left-1/2 translate-x-[20px] w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
          >
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        </div>

        {/* Content */}
        <div className="px-7 pb-7 flex flex-col flex-1 text-center">
          {/* Name */}
          

          {/* Role pill */}
          <div className="flex justify-center mt-2.5 mb-5">
            <span
              style={{
                background: `${member.color}14`,
                color: member.color,
                border: `1px solid ${member.color}30`,
              }}
              className="text-[11px] font-bold px-3.5 py-1 rounded-full tracking-widest uppercase"
            >
              {member.name}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{ background: `linear-gradient(to right, transparent, ${member.color}40, transparent)`, height: '1px' }}
            className="w-full mb-5"
          />

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-7">
            {member.description}
          </p>

          {/* LinkedIn button */}
          {member.linkedin && member.linkedin !== '#' && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: hovered ? member.gradRaw : 'rgba(255,255,255,0.04)',
                border: `1px solid ${hovered ? 'transparent' : 'rgba(255,255,255,0.09)'}`,
                color: hovered ? '#fff' : member.color,
                transition: 'all 0.35s',
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold"
            >
              <Linkedin className="w-4 h-4" />
              View Profile
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TeamPage
// ─────────────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  const nav = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const t = setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#060610] text-white overflow-x-hidden">

      {/* ── Ambient bg ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.09) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[400px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)' }} />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.025]"
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.05]">
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <img src={logo} alt="BetterYou"
               className="h-12 w-auto cursor-pointer hover:scale-105 transition-transform"
               onClick={() => nav('/')} />

          <div className="hidden md:flex items-center gap-8">
            {[['Features','/#features'],['Workouts','/#workouts'],['Nutrition','/#nutrition'],['About','/#about']].map(([l,h]) => (
              <a key={l} href={h}
                 className="text-gray-400 hover:text-[#D6F93D] transition-colors font-medium text-sm relative group">
                {l}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#D6F93D] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <span className="text-[#D6F93D] font-semibold text-sm relative">
              Team
              <span className="absolute -bottom-0.5 left-0 w-full h-px bg-[#D6F93D]" />
            </span>
            <button onClick={() => nav('/login')}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium text-sm">
              Login
            </button>
            <button onClick={() => nav('/register')}
                    className="px-6 py-2 bg-[#D6F93D] hover:bg-[#c5e835] text-gray-900 font-bold rounded-full text-sm transition-all hover:scale-105 shadow-lg shadow-[#D6F93D]/25">
              Get Started
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 pt-2 border-t border-white/[0.05] flex flex-col gap-2">
            {[['Features','/#features'],['Workouts','/#workouts'],['Nutrition','/#nutrition'],['About','/#about']].map(([l,h]) => (
              <a key={l} href={h} onClick={() => setMobileMenuOpen(false)}
                 className="text-gray-400 hover:text-[#D6F93D] py-2 px-3 rounded-lg hover:bg-white/5 transition-colors text-sm">
                {l}
              </a>
            ))}
            <button onClick={() => { nav('/team'); setMobileMenuOpen(false); }}
                    className="text-left text-[#D6F93D] font-semibold py-2 px-3 rounded-lg hover:bg-white/5 text-sm">Team</button>
            <button onClick={() => nav('/login')}
                    className="text-left text-gray-400 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 text-sm">Login</button>
            <button onClick={() => nav('/register')}
                    className="mt-1 py-3 bg-[#D6F93D] hover:bg-[#c5e835] text-gray-900 font-bold rounded-full text-sm text-center">
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* ── Main ── */}
      <main className="relative pt-36 pb-32 px-6">

        {/* Hero */}
        <div
          ref={heroRef}
          style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity 1s ease, transform 1s ease' }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm text-xs text-gray-400 uppercase tracking-widest mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6F93D] animate-pulse" />
            The people behind BetterYou
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-white">Built by </span>
            <span className="relative inline-block">
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #D6F93D 0%, #a3e635 35%, #818cf8 100%)' }}
              >
                passionate
              </span>
              <svg className="absolute -bottom-1 left-0 w-full" height="5" viewBox="0 0 200 5" preserveAspectRatio="none">
                <path d="M0 4 Q50 0 100 2.5 Q150 5 200 1.5"
                      stroke="#D6F93D" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65" />
              </svg>
            </span>
            <span className="text-white"> creators</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Five talented minds, one shared mission — to make health and fitness
            <span className="text-white font-semibold"> accessible, intelligent, and personal</span> for everyone.
          </p>

          {/* Mini stats */}
          <div className="flex justify-center gap-12 mt-10">
            {[['5','Team members'],['100%','Dedicated'],['1','Shared vision']].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-black text-white">{n}</div>
                <div className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-widest">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards — 3 top, 2 bottom centred */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {team.slice(0, 3).map((m, i) => <MemberCard key={m.name} member={m} index={i} />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {team.slice(3).map((m, i) => <MemberCard key={m.name} member={m} index={i + 3} />)}
          </div>
        </div>

        {/* Quote */}
        <div className="max-w-xl mx-auto text-center mt-24">
          <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/15 to-transparent mx-auto mb-8" />
          <blockquote className="text-xl md:text-2xl font-light text-gray-500 italic leading-relaxed">
            "Alone we can do so little —
            <span className="text-white font-medium not-italic"> together we can achieve anything.</span>"
          </blockquote>
          <button
            onClick={() => nav('/')}
            className="mt-10 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#D6F93D] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-8 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <img src={logo} alt="BetterYou" className="h-9 w-auto opacity-70" />
          <p className="text-gray-600 text-sm">© 2025 BetterYou. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="/#features" className="hover:text-[#D6F93D] transition-colors">Features</a>
            <a href="/#about"    className="hover:text-[#D6F93D] transition-colors">About</a>
            <button onClick={() => nav('/register')} className="hover:text-[#D6F93D] transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}