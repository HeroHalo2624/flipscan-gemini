import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Minus, Copy, Check, Scan, Star, StarOff,
  Clock, Zap, BarChart2, Tag, FileText, ExternalLink, Coffee, ChevronDown, ChevronUp
} from 'lucide-react'

const PLATFORM_COLORS = {
  'Facebook Marketplace': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'eBay': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Kijiji': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Craigslist': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
}

const DEMAND_CONFIG = {
  slow: { color: 'text-red-400', bg: 'bg-red-500/20', bars: 1, label: 'Slow Seller' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', bars: 2, label: 'Moderate Demand' },
  fast: { color: 'text-green-400', bg: 'bg-green-500/20', bars: 3, label: 'Fast Seller 🔥' },
}

const TREND_CONFIG = {
  rising: { icon: TrendingUp, color: 'text-green-400', label: 'Prices Rising ↑', bg: 'bg-green-500/10' },
  falling: { icon: TrendingDown, color: 'text-red-400', label: 'Prices Falling ↓', bg: 'bg-red-500/10' },
  stable: { icon: Minus, color: 'text-yellow-400', label: 'Prices Stable', bg: 'bg-yellow-500/10' },
}

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-all ${copied ? 'bg-brand-500/30 text-brand-300' : 'glass text-text-secondary hover:text-white'}`}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

function DemandMeter({ demand }) {
  const cfg = DEMAND_CONFIG[demand] || DEMAND_CONFIG.medium
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${cfg.bg} border border-white/5`}>
      <div className="flex gap-0.5">
        {[1,2,3].map(n => (
          <div key={n} className={`w-1.5 rounded-full transition-all ${n <= cfg.bars ? cfg.color.replace('text-','bg-') : 'bg-white/10'}`} style={{height: `${8 + n*4}px`, alignSelf:'flex-end'}} />
        ))}
      </div>
      <span className={`text-xs font-body font-medium ${cfg.color}`}>{cfg.label}</span>
    </div>
  )
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}
const row = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } }
}

export default function ResultsPage({ result }) {
  const nav = useNavigate()
  const [favorited, setFavorited] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)

  if (!result) return null

  const trend = TREND_CONFIG[result.priceTrend] || TREND_CONFIG.stable
  const TrendIcon = trend.icon

  const fullListing = `${result.suggestedTitle}\n\n${result.suggestedDescription}`

  return (
    <div className="min-h-dvh pb-28 overflow-y-auto">
      {/* Hero image */}
      <div className="relative">
        {result.imageDataUrl && (
          <div className="relative h-56 overflow-hidden">
            <img src={result.imageDataUrl} alt="Item" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
          </div>
        )}

        {/* Confidence badge */}
        <div className="absolute top-14 right-4 glass-strong rounded-2xl px-3 py-2">
          <div className="text-xs text-text-secondary">AI Confidence</div>
          <div className="font-display font-black text-xl gradient-text">{result.confidence}%</div>
        </div>

        {/* Favorite */}
        <button
          onClick={() => setFavorited(!favorited)}
          className="absolute top-14 left-4 glass-strong w-10 h-10 rounded-2xl flex items-center justify-center"
        >
          {favorited
            ? <Star size={18} className="text-yellow-400 fill-yellow-400" />
            : <StarOff size={18} className="text-text-secondary" />
          }
        </button>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-5 -mt-4 relative space-y-4"
      >
        {/* Item identity */}
        <motion.div variants={row} className="card rounded-3xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-brand-400 uppercase tracking-widest mb-1">{result.itemType}</div>
              <h2 className="font-display font-black text-xl text-white leading-tight">{result.itemName}</h2>
              {result.brand && (
                <p className="text-sm text-text-secondary mt-0.5">{result.brand} {result.model && `· ${result.model}`}</p>
              )}
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1">
              <div className={`text-xs px-2 py-1 rounded-lg border ${
                result.condition === 'Excellent' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                result.condition === 'Good' ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' :
                result.condition === 'Fair' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                'bg-red-500/20 text-red-300 border-red-500/30'
              }`}>
                {result.condition}
              </div>
            </div>
          </div>

          {/* Trend indicator */}
          <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${trend.bg}`}>
            <TrendIcon size={14} className={trend.color} />
            <span className={`text-xs font-body font-medium ${trend.color}`}>{trend.label}</span>
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div variants={row} className="card rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-brand-400" />
            <span className="font-display font-bold text-sm text-white uppercase tracking-wide">Estimated Value</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Low', value: result.priceLow, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: 'Avg', value: result.priceAvg, color: 'text-brand-400', bg: 'bg-brand-500/15', highlight: true },
              { label: 'High', value: result.priceHigh, color: 'text-green-400', bg: 'bg-green-500/10' },
            ].map(({ label, value, color, bg, highlight }) => (
              <div key={label} className={`${bg} rounded-2xl p-3 text-center ${highlight ? 'ring-1 ring-brand-500/30' : ''}`}>
                <div className="text-xs text-text-secondary mb-1">{label}</div>
                <div className={`font-display font-black text-lg ${color}`}>${value}</div>
                <div className="text-xs text-text-muted">CAD</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <DemandMeter demand={result.demand} />
            <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-xl">
              <Clock size={12} className="text-brand-400" />
              <span className="text-xs text-text-secondary">{result.timeToSell}</span>
            </div>
          </div>
        </motion.div>

        {/* Best platforms */}
        <motion.div variants={row} className="card rounded-3xl">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={16} className="text-brand-400" />
            <span className="font-display font-bold text-sm text-white uppercase tracking-wide">Best Platforms</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(result.platforms || []).map((p, i) => (
              <div key={p} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-body font-medium ${PLATFORM_COLORS[p] || 'bg-white/10 text-white border-white/10'}`}>
                {i === 0 && <Zap size={11} className="shrink-0" />}
                {p}
                {i === 0 && <span className="text-xs opacity-60">· Best</span>}
              </div>
            ))}
          </div>
          {result.sellingTips && (
            <div className="mt-3 bg-brand-500/5 rounded-xl px-3 py-2 text-xs text-text-secondary leading-relaxed">
              💡 {result.sellingTips}
            </div>
          )}
        </motion.div>

        {/* Generated listing */}
        <motion.div variants={row} className="card rounded-3xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-brand-400" />
              <span className="font-display font-bold text-sm text-white uppercase tracking-wide">AI Listing</span>
            </div>
            <CopyButton text={fullListing} label="Copy All" />
          </div>

          {/* Title */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-text-muted uppercase tracking-wide">Title</span>
              <CopyButton text={result.suggestedTitle} label="Copy" />
            </div>
            <div className="bg-surface-2 rounded-xl px-3 py-2.5 text-sm text-white font-body">
              {result.suggestedTitle}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-text-muted uppercase tracking-wide">Description</span>
              <CopyButton text={result.suggestedDescription} label="Copy" />
            </div>
            <div className="bg-surface-2 rounded-xl px-3 py-2.5 text-xs text-text-secondary leading-relaxed relative overflow-hidden">
              <div className={showFullDesc ? '' : 'max-h-24 overflow-hidden'}>
                {result.suggestedDescription}
              </div>
              {!showFullDesc && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface-2" />
              )}
            </div>
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="flex items-center gap-1 mt-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              {showFullDesc ? <><ChevronUp size={12} />Show less</> : <><ChevronDown size={12} />Show full description</>}
            </button>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={row} className="flex flex-col gap-3 pt-1">
          <button
            onClick={() => nav('/scan')}
            className="btn-primary flex items-center justify-center gap-2 py-4 text-base"
          >
            <Scan size={20} />
            Scan Another Item
          </button>
          <a
            href="https://buymeacoffee.com/brianm2624"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center justify-center gap-2 py-3 text-sm"
          >
            <Coffee size={16} className="text-yellow-400" />
            Support the Developer ☕
            <ExternalLink size={12} className="text-text-muted" />
          </a>
        </motion.div>

        <p className="text-center text-xs text-text-muted pb-2">Built by Brian · FlipScan AI</p>
      </motion.div>
    </div>
  )
}
