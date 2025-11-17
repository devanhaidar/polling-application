import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoteData } from '../../hooks/useVoteData'

const VotingModal = ({ category, isOpen, onClose, onVoteSuccess }) => {
  const [selectedCandidate, setSelectedCandidate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { submitVote } = useVoteData()

  // Sound effect - akan digunakan jika file audio tersedia
  // Untuk sementara, kita skip use-sound karena file belum ada
  // Nanti bisa uncomment dan tambahkan file audio di /public/sounds/vote_click.mp3
  const playVoteSound = () => {
    try {
      // Jika file audio sudah ada, uncomment ini:
      // const audio = new Audio('/sounds/vote_click.mp3')
      // audio.volume = 0.5
      // audio.play().catch(() => {})
    } catch (error) {
      // Continue without sound
    }
  }

  const handleVote = async () => {
    if (!selectedCandidate) {
      alert('Silakan pilih kandidat terlebih dahulu!')
      return
    }

    setIsSubmitting(true)
    
    // Play sound effect (jika file ada)
    try {
      playVoteSound()
    } catch (error) {
      // Continue without sound if file doesn't exist
    }

    try {
      // Submit vote to API
      await submitVote(category.id, selectedCandidate)

      // Show success animation
      setShowSuccess(true)
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Close modal and notify parent
      if (onVoteSuccess) {
        onVoteSuccess()
      }
      handleClose()
    } catch (error) {
      console.error('Error submitting vote:', error)
      alert('Gagal mengirim vote. Silakan coba lagi.')
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedCandidate('')
    setShowSuccess(false)
    setIsSubmitting(false)
    onClose()
  }

  if (!category) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                      <span className="text-4xl">{category.icon || '🏆'}</span>
                      {category.name}
                    </h2>
                    <p className="text-white/90">{category.description}</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {!showSuccess ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Pilih Kandidat Favorit Anda:
                    </h3>
                    <div className="space-y-3">
                      {category.candidates?.map((candidate, index) => (
                        <motion.label
                          key={candidate}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedCandidate === candidate
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="candidate"
                            value={candidate}
                            checked={selectedCandidate === candidate}
                            onChange={(e) => setSelectedCandidate(e.target.value)}
                            className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="ml-4 text-lg font-medium text-gray-800">
                            {candidate}
                          </span>
                          {selectedCandidate === candidate && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto"
                            >
                              <span className="text-2xl">✓</span>
                            </motion.div>
                          )}
                        </motion.label>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6"
                    >
                      <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold text-gray-800 mb-2"
                    >
                      Vote Berhasil!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 text-lg"
                    >
                      Terima kasih atas partisipasi Anda
                    </motion.p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              {!showSuccess && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={handleVote}
                    disabled={!selectedCandidate || isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                      selectedCandidate && !isSubmitting
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? 'Memproses...' : 'Vote Sekarang!'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default VotingModal
