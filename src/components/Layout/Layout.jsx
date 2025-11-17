import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Layout = ({ children }) => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/results', label: 'Results', icon: '📊' },
    { path: '/customize', label: 'Customize', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen">
      <header className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            🏆 PMI Awards 2025 🏆
          </h1>
          <p className="text-white/80 text-center mt-2 text-lg">
            Pilih Kategori Penghargaan Favorit Anda
          </p>
          
          {/* Navigation Menu */}
          <nav className="mt-6 flex justify-center gap-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-white/20 text-white shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout

