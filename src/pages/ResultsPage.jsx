import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ResultsChart from '../components/ResultsChart/ResultsChart'
import * as api from '../services/api'
import { useAudioPlayer } from '../hooks/useAudioPlayer'

const ResultsPage = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Audio player - akan digunakan jika file audio tersedia
  // Untuk sementara, kita skip karena file belum ada
  // const { isPlaying, toggleMute, isMuted } = useAudioPlayer('/sounds/award_reveal.mp3', { loop: true })

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true)
        const data = await api.getResults()
        setResults(data)
        setError(null)
      } catch (err) {
        console.error('Error loading results:', err)
        setError(err.message)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    loadResults()

    // Auto-refresh setiap 5 detik untuk update real-time
    const interval = setInterval(loadResults, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-purple-500 rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-200 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Audio Control - akan diaktifkan jika file audio tersedia */}
      {/* <div className="mb-6 flex justify-end">
        <button
          onClick={toggleMute}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
      </div> */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-xl">Belum ada hasil voting</p>
            <p className="text-white/70 mt-2">Mulai voting untuk melihat hasil!</p>
          </div>
        ) : (
          results.map((result, index) => (
            <ResultsChart
              key={result.categoryId}
              categoryName={result.categoryName}
              categoryIcon={result.categoryIcon}
              candidates={result.candidates}
            />
          ))
        )}
      </motion.div>
    </div>
  )
}

export default ResultsPage
