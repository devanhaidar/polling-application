import { useState, useEffect } from 'react'
import * as api from '../services/api'

export const useVoteData = () => {
  const [votes, setVotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load votes from API
  useEffect(() => {
    const loadVotes = async () => {
      try {
        setLoading(true)
        const votesData = await api.getAllVotes()
        setVotes(votesData)
        setError(null)
      } catch (err) {
        console.error('Error loading votes:', err)
        setError(err.message)
        // Fallback to empty object if API fails
        setVotes({})
      } finally {
        setLoading(false)
      }
    }

    loadVotes()
  }, [])

  const submitVote = async (categoryId, candidateName) => {
    try {
      const response = await api.submitVote(categoryId, candidateName)
      // Update local state with new vote
      setVotes(prevVotes => ({
        ...prevVotes,
        [categoryId]: response.votes
      }))
      return { success: true }
    } catch (err) {
      console.error('Error submitting vote:', err)
      throw err
    }
  }

  const getCategoryResults = (categoryId) => {
    if (!votes[categoryId]) return []
    
    return Object.entries(votes[categoryId])
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }

  return {
    votes,
    loading,
    error,
    submitVote,
    getCategoryResults
  }
}
