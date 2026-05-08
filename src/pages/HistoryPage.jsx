import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trash2, ChevronRight, Scan, Search, SlidersHorizontal } from 'lucide-react'

export default function HistoryPage({ history, onClear, setScanResult }) {
  const nav = useNavigate()
  const [search, setSearch] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const filtered = history.filter(h =>
    !search || h.itemName?.toLowerCase().includes(search.toLowerCase()) ||
    h.itemType?.toLowerCase().includes(search.toLowerCase())
  )

  const viewResult = (item) => {
    setScanResult(item)
    nav('/results')
  }

  return (
    <div className="min-h-dvh pb-28">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-2xl text-white">Scan History</h1>
            <p className="text-xs text-text-secondary mt-0.5">{history.length} items scanned</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="glass w-10 h-10 rounded-2xl flex items-center justify-center"
            >
              <Trash2 size={16} className="text-red-400" />
            </button>
          )}
        </div>

        {history.length > 0 && (
          <div className="relative mt-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search items…"
              className="w-full bg-surface-2 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white border border-white/8 focus:outline-none focus:border-brand-500/50"
            />
          </div>
        )}
      </div>

      {/* Confirm clear */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end px-5 pb-8"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="glass-strong rounded-3xl p-5 w-full"
            >
              <h3 className="font-display font-bold text-white text-lg mb-1">Clear all history?</h3>
              <p className="text-sm text-text-secondary mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="btn-ghost flex-1">Cancel</button>
                <button onClick={() => { onClear(); setShowConfirm(false) }} className="flex-1 bg-red-500/80 hover:bg-red-500 text-white font-display font-semibold py-3 rounded-2xl transition-colors">
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 space-y-3">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-surface-2 flex items-center justify-center mb-4">
              <Clock size={32} className="text-text-muted" />
            </div>
            <p className="font-display font-bold text-white mb-1">
              {search ? 'No matches found' : 'No scans yet'}
            </p>
            <p className="text-sm text-text-secondary mb-6">
              {search ? 'Try a different search' : 'Start scanning items to see them here'}
            </p>
            {!search && (
              <button onClick={() => nav('/scan')} className="btn-primary flex items-center gap-2">
                <Scan size={18} />
                Scan Your First Item
              </button>
            )}
          </motion.div>
        ) : (
          filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => viewResult(item)}
              className="card rounded-2xl cursor-pointer hover:bg-white/8 transition-all duration-200 active:scale-98 flex items-center gap-3"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-surface-2">
                {item.imageDataUrl
                  ? <img src={item.imageDataUrl} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-sm text-white truncate">{item.itemName || 'Unknown Item'}</div>
                <div className="text-xs text-text-secondary truncate mt-0.5">{item.itemType}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-brand-400 font-medium">${item.priceAvg} CAD</span>
                  <span className="text-xs text-text-muted">·</span>
                  <span className="text-xs text-text-muted">{new Date(item.scannedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <ChevronRight size={16} className="text-text-muted shrink-0" />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
