import React from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

const ResultsChart = ({ categoryName, categoryIcon, candidates }) => {
  const maxVotes = Math.max(...candidates.map(c => c.count), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{categoryIcon}</span>
        <h3 className="text-2xl font-bold text-gray-800">{categoryName}</h3>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate, index) => (
          <CandidateBar
            key={candidate.name}
            candidate={candidate}
            maxVotes={maxVotes}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  )
}

const CandidateBar = ({ candidate, maxVotes, index }) => {
  const [displayCount, setDisplayCount] = useState(0)
  const percentage = maxVotes > 0 ? (candidate.count / maxVotes) * 100 : 0

  // Animate count-up
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = candidate.count / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(candidate.count, increment * step)
      setDisplayCount(Math.floor(current))

      if (step >= steps) {
        setDisplayCount(candidate.count)
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [candidate.count])

  // Animate bar width
  const width = useSpring(0, {
    stiffness: 100,
    damping: 30
  })

  useEffect(() => {
    width.set(percentage)
  }, [percentage, width])

  const widthString = useTransform(width, (value) => `${value}%`)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800 text-lg">
          {candidate.name}
        </span>
        <motion.span
          key={displayCount}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="font-bold text-purple-600 text-xl"
        >
          {displayCount}
        </motion.span>
      </div>
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          style={{ width: widthString }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

export default ResultsChart
