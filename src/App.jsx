import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import CustomizePage from './pages/CustomizePage'
import VotingModal from './components/VotingModal/VotingModal'

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const handleVoteSuccess = () => {
    // Bisa tambahkan notifikasi atau action lain setelah vote berhasil
    console.log('Vote berhasil!')
  }

  return (
    <Layout>
      <Routes>
        <Route 
          path="/" 
          element={<HomePage onCategorySelect={handleCategorySelect} />} 
        />
        <Route 
          path="/results" 
          element={<ResultsPage />} 
        />
        <Route 
          path="/customize" 
          element={<CustomizePage />} 
        />
      </Routes>
      <VotingModal
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onVoteSuccess={handleVoteSuccess}
      />
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
