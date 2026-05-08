import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Settings, Scan, Image, AlertCircle, ExternalLink } from 'lucide-react'
import { analyzeImage } from '../api/analyze'

const SCAN_STAGES = [
  { label: 'Initializing Gemini vision…', pct: 15 },
  { label: 'Identifying item…', pct: 35 },
  { label: 'Checking market prices…', pct: 60 },
  { label: 'Analyzing condition…', pct: 78 },
  { label: 'Generating listing…', pct: 92 },
  { label: 'Finalizing results…', pct: 99 },
]

export default function ScanPage({ setScanResult, addToHistory }) {
  const nav = useNavigate()
  const fileInputRef = useRef()
  const cameraInputRef = useRef()
  const [preview, setPreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [stageIdx, setStageIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [showBbox, setShowBbox] = useState(false)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setError(null)
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const runScan = useCallback(async () => {
    if (!imageFile) return

    // Pass personal key if user set one, otherwise server key is used
    const userApiKey = localStorage.getItem('flipscan_apikey') || ''

    setScanning(true)
    setStageIdx(0)
    setProgress(0)
    setShowBbox(false)
    setError(null)

    let si = 0
    const stageTimer = setInterval(() => {
      if (si < SCAN_STAGES.length - 1) {
        si++
        setStageIdx(si)
        setProgress(SCAN_STAGES[si].pct)
      }
    }, 700)

    setTimeout(() => setShowBbox(true), 800)

    try {
      const result = await analyzeImage(imageFile, userApiKey)
      clearInterval(stageTimer)
      setProgress(100)
      await new Promise(r => setTimeout(r, 400))
      const entry = addToHistory({ ...result, imageDataUrl: preview })
      setScanResult({ ...entry, imageDataUrl: preview })
      nav('/results')
    } catch (err) {
      clearInterval(stageTimer)
      setScanning(false)
      setShowBbox(false)
      setProgress(0)
      setError(err.message || 'Analysis failed. Please try again.')
    }
  }, [imageFile, preview, addToHistory, setScanResult, nav])

  return (
    <div className="min-h-dvh flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Scan Item</h1>
          <p className="text-xs text-text-secondary mt-0.5">Upload or capture a photo</p>
        </div>
        <button
          onClick={() => nav('/settings')}
          className="glass w-10 h-10 rounded-2xl flex items-center justify-center"
          title="Settings"
        >
          <Settings size={18} className="text-brand-400" />
        </button>
      </div>

      {/* Main scan area */}
      <div className="flex-1 px-5">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative rounded-3xl overflow-hidden cursor-pointer group"
              style={{
                height: '52vw',
                maxHeight: '320px',
                minHeight: '200px',
                background: 'linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(13,148,136,0.03) 100%)',
                border: '2px dashed rgba(20,184,166,0.3)'
              }}
            >
              {[
                'top-4 left-4 border-t-2 border-l-2',
                'top-4 right-4 border-t-2 border-r-2',
                'bottom-4 left-4 border-b-2 border-l-2',
                'bottom-4 right-4 border-b-2 border-r-2',
              ].map((cls, i) => (
                <div key={i} className={`absolute w-6 h-6 border-brand-400 ${cls} rounded-sm animate-pulse`} style={{animationDelay:`${i*0.25}s`}} />
              ))}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-3xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                  <Image size={28} className="text-brand-400" />
                </div>
                <div className="text-center">
                  <p className="font-display font-semibold text-white text-sm">Tap to upload photo</p>
                  <p className="text-xs text-text-secondary mt-1">or use camera below</p>
                </div>
              </div>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e.target.files[0])} />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => cameraInputRef.current?.click()} className="btn-primary flex items-center justify-center gap-2 py-4 rounded-2xl">
                <Camera size={20} />Camera
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="btn-ghost flex items-center justify-center gap-2 py-4">
                <Upload size={20} />Gallery
              </button>
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs font-display font-semibold text-text-secondary uppercase tracking-wide">For best results</p>
              {['📸 Good lighting, clear background','🏷️ Show brand labels if visible','📐 Include the whole item in frame'].map(tip => (
                <div key={tip} className="glass rounded-xl px-3 py-2 text-xs text-text-secondary">{tip}</div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            {/* Image preview with scan overlay */}
            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img src={preview} alt="Item" className="w-full h-full object-cover" />

              {scanning && (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-black/40" />
                  <motion.div
                    className="absolute left-0 right-0 h-0.5"
                    style={{ background: 'linear-gradient(90deg, transparent, #14b8a6, #2dd4bf, #14b8a6, transparent)', boxShadow: '0 0 10px #14b8a6' }}
                    animate={{ top: ['5%', '95%', '5%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {showBbox && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute"
                      style={{ top: '20%', left: '15%', right: '15%', bottom: '20%' }}
                    >
                      <div className="relative w-full h-full animate-[scanBox_1.5s_ease-in-out_infinite]">
                        <div className="absolute inset-0 border-2 border-brand-400/70 rounded-lg" />
                        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-brand-300" />
                        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-brand-300" />
                        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-brand-300" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-brand-300" />
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap glass-strong rounded-full px-3 py-1 text-xs font-mono text-brand-300"
                        >
                          Analyzing…
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-brand-400" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-brand-400" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-brand-400" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-brand-400" />
                </div>
              )}

              {!scanning && (
                <button onClick={() => { setPreview(null); setImageFile(null); setError(null) }} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
                  <X size={16} className="text-white" />
                </button>
              )}
            </div>

            {/* Progress */}
            {scanning && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 card rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-brand-300">{SCAN_STAGES[stageIdx]?.label}</span>
                  <span className="text-xs font-mono text-text-secondary">{progress}%</span>
                </div>
                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #0d9488, #2dd4bf)' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {['Vision AI', 'Pricing', 'Listing'].map((s, i) => (
                    <div key={s} className={`text-center py-2 rounded-xl text-xs ${stageIdx > i * 2 ? 'bg-brand-500/20 text-brand-300' : 'bg-surface-2 text-text-muted'}`}>{s}</div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
                {error.includes('API key') && (
                  <button onClick={() => nav('/settings')} className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    <Settings size={12} />Go to Settings to add your Gemini key
                    <ExternalLink size={10} />
                  </button>
                )}
              </motion.div>
            )}

            {!scanning && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={runScan}
                className="btn-primary w-full mt-4 py-4 flex items-center justify-center gap-2 text-base"
              >
                <Scan size={22} />
                Analyze with AI
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
