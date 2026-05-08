import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, Zap, TrendingUp, DollarSign, Star, ArrowRight, Scan, Package, Shirt, Tv, Wrench, Coffee } from 'lucide-react'

const features = [
  { icon: Camera, title: 'Snap & Identify', desc: 'Point your camera at any item and AI instantly recognizes it' },
  { icon: DollarSign, title: 'Instant Pricing', desc: 'Real-time value estimates in CAD & USD across all platforms' },
  { icon: TrendingUp, title: 'Market Trends', desc: 'Know if prices are rising or falling before you list' },
  { icon: Zap, title: 'Auto Listings', desc: 'AI writes your title & description in seconds' },
]

const categories = [
  { icon: Tv, label: 'Electronics' },
  { icon: Shirt, label: 'Clothing' },
  { icon: Package, label: 'Collectibles' },
  { icon: Wrench, label: 'Tools' },
]

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <div className="min-h-dvh flex flex-col relative">
      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-5 pt-16 pb-8 text-center overflow-hidden">
        {/* Scan grid lines */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(20,184,166,1) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8"
        >
          {/* Logo icon */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-brand-500/20 animate-pulse" />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center glow-brand">
              <Scan size={44} className="text-white" strokeWidth={1.5} />
            </div>
            {/* Corner accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-brand-300 rounded-tl-sm" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-brand-300 rounded-tr-sm" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-brand-300 rounded-bl-sm" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-brand-300 rounded-br-sm" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-xs font-mono text-brand-300 tracking-widest uppercase">AI-Powered Resale</span>
          </div>

          <h1 className="font-display text-5xl font-black mb-3 leading-[1.05]">
            Flip<span className="gradient-text">Scan</span><br />
            <span className="text-white/90">AI</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xs mx-auto leading-relaxed">
            Scan any item. Get instant resale prices for eBay, Kijiji & Facebook Marketplace.
          </p>
        </motion.div>

        {/* Category pills */}
        <motion.div
          className="flex gap-2 mt-6 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {categories.map(({ icon: Icon, label }) => (
            <div key={label} className="glass flex items-center gap-1.5 px-3 py-1.5 rounded-full">
              <Icon size={13} className="text-brand-400" />
              <span className="text-xs text-white/70 font-body">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col gap-3 w-full max-w-xs mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => nav('/scan')}
            className="btn-primary flex items-center justify-center gap-2 text-base py-4 rounded-2xl w-full"
          >
            <Camera size={20} />
            Start Scanning Free
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => nav('/history')}
            className="btn-ghost text-base py-3.5 w-full"
          >
            View Scan History
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="flex items-center gap-3 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex -space-x-2">
            {['bg-brand-500','bg-purple-500','bg-pink-500','bg-orange-500'].map((c,i) => (
              <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-surface`} />
            ))}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-xs text-text-secondary">10k+ flippers trust FlipScan</p>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="px-5 pb-6 grid grid-cols-2 gap-3"
      >
        {features.map(({ icon: Icon, title, desc }) => (
          <motion.div key={title} variants={item} className="card">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/15 flex items-center justify-center mb-3">
              <Icon size={20} className="text-brand-400" />
            </div>
            <h3 className="font-display font-semibold text-sm text-white mb-1">{title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pricing teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-5 mb-5 rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(13,148,136,0.05) 100%)', border: '1px solid rgba(20,184,166,0.2)' }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-brand-400" />
                <span className="font-display font-bold text-white text-sm">Go Premium</span>
              </div>
              <p className="text-xs text-text-secondary">Unlimited scans + market analytics</p>
            </div>
            <div className="text-right">
              <div className="font-display font-black text-brand-400 text-xl">$4.99</div>
              <div className="text-xs text-text-secondary">/month</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-4 text-xs text-white/70">
            {['∞ Scans/day', 'Exact pricing', 'Batch mode', 'Export CSV'].map(f => (
              <div key={f} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                {f}
              </div>
            ))}
          </div>
          <button className="btn-primary w-full text-sm py-3" onClick={() => nav('/settings')}>
            Upgrade Now
          </button>
        </div>
      </motion.div>

      {/* Support dev */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-5 pb-8 text-center"
      >
        <a
          href="https://buymeacoffee.com/brianm2624"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 glass px-5 py-3 rounded-2xl hover:bg-white/10 transition-all duration-200 group"
        >
          <Coffee size={18} className="text-yellow-400 group-hover:scale-110 transition-transform" />
          <span className="font-display font-semibold text-sm text-white">Buy me a coffee ☕</span>
        </a>
        <p className="text-xs text-text-muted mt-3">Built by Brian · FlipScan AI v1.0</p>
      </motion.div>
    </div>
  )
}
