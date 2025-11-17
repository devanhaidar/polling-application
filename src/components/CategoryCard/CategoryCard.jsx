import React from 'react'
import { motion } from 'framer-motion'

const CategoryCard = ({ category, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 border border-white/20"
    >
      <div className="flex items-center justify-center mb-4">
        <span className="text-5xl">{category.icon || '🏆'}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
        {category.name}
      </h3>
      <p className="text-gray-600 text-sm text-center">
        {category.description}
      </p>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {category.candidates?.length || 0} Kandidat
        </p>
      </div>
    </motion.div>
  )
}

export default CategoryCard

