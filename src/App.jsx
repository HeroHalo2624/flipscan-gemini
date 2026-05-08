import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import ScanPage from './pages/ScanPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import BottomNav from './components/BottomNav'

export default function App() {
  const [scanResult, setScanResult] = useState(null)
  const [scanHistory, setScanHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flipscan_history') || '[]') } catch { return [] }
  })

  const addToHistory = (result) => {
    const entry = { ...result, id: Date.now(), scannedAt: new Date().toISOString() }
    const updated = [entry, ...scanHistory].slice(0, 50)
    setScanHistory(updated)
    localStorage.setItem('flipscan_history', JSON.stringify(updated))
    return entry
  }

  const clearHistory = () => {
    setScanHistory([])
    localStorage.removeItem('flipscan_history')
  }

  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-surface text-white font-body relative overflow-x-hidden">
        {/* Ambient background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="floating-orb w-96 h-96 bg-brand-900/20 -top-20 -right-20 animate-float" style={{animationDelay:'0s'}} />
          <div className="floating-orb w-64 h-64 bg-brand-800/10 bottom-40 -left-20 animate-float" style={{animationDelay:'1.5s'}} />
        </div>

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/scan" element={
              <ScanPage setScanResult={setScanResult} addToHistory={addToHistory} />
            } />
            <Route path="/results" element={
              scanResult
                ? <ResultsPage result={scanResult} />
                : <Navigate to="/scan" replace />
            } />
            <Route path="/history" element={
              <HistoryPage history={scanHistory} onClear={clearHistory} setScanResult={setScanResult} />
            } />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AnimatePresence>

        <Routes>
          <Route path="/scan" element={<BottomNav />} />
          <Route path="/results" element={<BottomNav />} />
          <Route path="/history" element={<BottomNav />} />
          <Route path="/settings" element={<BottomNav />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
