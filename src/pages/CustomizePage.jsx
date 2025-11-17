import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as api from '../services/api'

const CustomizePage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await api.getCategories()
      setCategories(data)
      setError(null)
    } catch (err) {
      console.error('Error loading categories:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.updateCategories(categories)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving categories:', err)
      alert('Gagal menyimpan perubahan. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = () => {
    const newCategory = {
      id: Date.now().toString(),
      name: '',
      description: '',
      icon: '🏆',
      candidates: []
    }
    setCategories([...categories, newCategory])
    setEditingCategory(newCategory.id)
    setShowAddForm(false)
  }

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId))
    }
  }

  const handleUpdateCategory = (categoryId, field, value) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    ))
  }

  const handleAddCandidate = (categoryId) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, candidates: [...cat.candidates, ''] }
        : cat
    ))
  }

  const handleUpdateCandidate = (categoryId, candidateIndex, value) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            candidates: cat.candidates.map((c, i) =>
              i === candidateIndex ? value : c
            )
          }
        : cat
    ))
  }

  const handleDeleteCandidate = (categoryId, candidateIndex) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            candidates: cat.candidates.filter((_, i) => i !== candidateIndex)
          }
        : cat
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">Memuat kategori...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Customize Polling</h2>
        <div className="flex gap-3">
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
          >
            + Tambah Kategori
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-500 text-white rounded-lg"
          >
            ✅ Perubahan berhasil disimpan!
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mb-6 p-4 bg-red-500 text-white rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="space-y-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={category.icon}
                    onChange={(e) => handleUpdateCategory(category.id, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="🏆"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Kategori
                  </label>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => handleUpdateCategory(category.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nama kategori"
                  />
                </div>
              </div>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="ml-4 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                🗑️
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={category.description}
                onChange={(e) => handleUpdateCategory(category.id, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="2"
                placeholder="Deskripsi kategori"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Kandidat
                </label>
                <button
                  onClick={() => handleAddCandidate(category.id)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                >
                  + Tambah Kandidat
                </button>
              </div>
              <div className="space-y-2">
                {category.candidates.map((candidate, candidateIndex) => (
                  <div key={candidateIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={candidate}
                      onChange={(e) => handleUpdateCandidate(category.id, candidateIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={`Kandidat ${candidateIndex + 1}`}
                    />
                    <button
                      onClick={() => handleDeleteCandidate(category.id, candidateIndex)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white text-xl mb-4">Belum ada kategori</p>
          <button
            onClick={handleAddCategory}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            + Tambah Kategori Pertama
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomizePage

