import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Zap, Coffee, ExternalLink, ChevronRight, Shield, Info, Star } from 'lucide-react'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const row = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } } }

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('flipscan_apikey') || '')
  const [saved, setSaved] = useState(false)
  const [showPremium, setShowPremium] = useState(false)

  const saveKey = () => {
    localStorage.setItem('flipscan_apikey', apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const clearKey = () => {
    setApiKey('')
    localStorage.removeItem('flipscan_apikey')
  }

  return (
    <div className="min-h-dvh pb-28">
      <div className="px-5 pt-14 pb-6">
        <h1 className="font-display font-black text-2xl text-white">Settings</h1>
        <p className="text-xs text-text-secondary mt-0.5">Configure FlipScan AI</p>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="px-5 space-y-4">

        {/* API Key */}
        <motion.div variants={row} className="card rounded-3xl">
          <div className="flex items-center gap-2 mb-3">
            <Key size={16} className="text-brand-400" />
            <span className="font-display font-bold text-sm text-white">Gemini API Key</span>
            <span className="text-xs bg-surface-2 text-text-muted px-2 py-0.5 rounded-full">Optional</span>
          </div>
          <p className="text-xs text-text-secondary mb-1 leading-relaxed">
            Only needed if the app owner hasn't configured a server key. Get a free key at{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline">
              aistudio.google.com
            </a>
          </p>
          <p className="text-xs text-text-muted mb-3">Your key is stored only on this device — never sent to our servers.</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 bg-surface-2 rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={saveKey}
              className={`px-4 py-2.5 rounded-xl text-sm font-display font-semibold transition-all ${saved ? 'bg-green-500/30 text-green-300' : 'btn-primary'}`}
            >
              {saved ? '✓' : 'Save'}
            </button>
          </div>
          {apiKey && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Personal key active</span>
              </div>
              <button onClick={clearKey} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
            </div>
          )}
        </motion.div>

        {/* How to get a key */}
        <motion.div variants={row} className="card rounded-3xl">
          <p className="text-xs font-display font-semibold text-brand-300 uppercase tracking-wide mb-3">How to get a free Gemini key</p>
          <div className="space-y-2">
            {[
              { n: '1', text: 'Go to aistudio.google.com/apikey' },
              { n: '2', text: 'Sign in with your Google account' },
              { n: '3', text: 'Click "Create API Key"' },
              { n: '4', text: 'Copy the key (starts with AIzaSy...)' },
              { n: '5', text: 'Paste it in the field above and tap Save' },
            ].map(({ n, text }) => (
              <div key={n} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-mono text-brand-400">{n}</span>
                </div>
                <span className="text-xs text-text-secondary">{text}</span>
              </div>
            ))}
          </div>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-4 w-full py-2.5 rounded-2xl text-xs font-display font-semibold glass hover:bg-white/10 transition-all text-brand-300"
          >
            Open Google AI Studio
            <ExternalLink size={12} />
          </a>
        </motion.div>

        {/* Premium */}
        <motion.div variants={row}>
          <div
            className="rounded-3xl overflow-hidden cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(20,184,166,0.2) 0%, rgba(13,148,136,0.08) 100%)',
              border: '1px solid rgba(20,184,166,0.25)'
            }}
            onClick={() => setShowPremium(!showPremium)}
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-brand-400" />
                  <span className="font-display font-bold text-white">FlipScan Premium</span>
                  <span className="text-xs bg-brand-500/30 text-brand-300 px-2 py-0.5 rounded-full">$4.99/mo</span>
                </div>
                <ChevronRight size={16} className={`text-text-secondary transition-transform ${showPremium ? 'rotate-90' : ''}`} />
              </div>

              {showPremium && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['∞ Scans/day', '3/day free'],
                      ['Exact pricing', 'Range only'],
                      ['Batch scan', 'Single only'],
                      ['Export CSV', '—'],
                      ['Market analytics', '—'],
                      ['No ads', 'Ads shown'],
                    ].map(([pro, free]) => (
                      <div key={pro} className="bg-white/5 rounded-xl p-2.5">
                        <div className="text-xs font-medium text-brand-300">{pro}</div>
                        <div className="text-xs text-text-muted mt-0.5">Free: {free}</div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                    <Star size={15} className="fill-white" />
                    Upgrade to Premium
                  </button>
                  <p className="text-center text-xs text-text-muted">Coming soon · Join the waitlist</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Support Dev */}
        <motion.div variants={row} className="card rounded-3xl">
          <div className="flex items-center gap-2 mb-3">
            <Coffee size={16} className="text-yellow-400" />
            <span className="font-display font-bold text-sm text-white">Support the Developer</span>
          </div>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            FlipScan AI is built and maintained by one developer. If it's helped you sell items faster, consider buying me a coffee! ☕
          </p>
          <a
            href="https://buymeacoffee.com/brianm2624"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-display font-semibold text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#1a0f00' }}
          >
            <Coffee size={18} />
            Buy Me a Coffee
            <ExternalLink size={13} />
          </a>
        </motion.div>

        {/* About */}
        <motion.div variants={row} className="card rounded-3xl space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Info size={16} className="text-brand-400" />
            <span className="font-display font-bold text-sm text-white">About</span>
          </div>
          {[
            { label: 'Version', value: '1.1.0' },
            { label: 'AI Model', value: 'Gemini 1.5 Flash' },
            { label: 'Built by', value: 'Brian' },
            { label: 'Privacy', value: 'Images sent directly to Google AI' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{label}</span>
              <span className="text-xs text-white font-body">{value}</span>
            </div>
          ))}
        </motion.div>

        {/* Privacy */}
        <motion.div variants={row} className="flex items-start gap-2 px-1">
          <Shield size={14} className="text-text-muted mt-0.5 shrink-0" />
          <p className="text-xs text-text-muted leading-relaxed">
            Images are analyzed via the Google Gemini API. If you use a personal key, it stays on your device. Server-mode uses an environment variable only accessible to the backend.
          </p>
        </motion.div>

        <motion.div variants={row} className="text-center pb-2">
          <p className="text-xs text-text-muted">Built with ❤️ by Brian · FlipScan AI © 2025</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
