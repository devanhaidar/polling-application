const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Helper function untuk fetch dengan error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Get all categories
export const getCategories = async () => {
  return fetchAPI('/categories')
}

// Get all results
export const getResults = async () => {
  return fetchAPI('/results')
}

// Get results for specific category
export const getCategoryResults = async (categoryId) => {
  return fetchAPI(`/results/${categoryId}`)
}

// Submit a vote
export const submitVote = async (categoryId, candidateName) => {
  return fetchAPI('/vote', {
    method: 'POST',
    body: JSON.stringify({ categoryId, candidateName })
  })
}

// Update categories
export const updateCategories = async (categories) => {
  return fetchAPI('/categories', {
    method: 'PUT',
    body: JSON.stringify({ categories })
  })
}

// Get all votes (for admin)
export const getAllVotes = async () => {
  return fetchAPI('/votes')
}

// Health check
export const healthCheck = async () => {
  return fetchAPI('/health')
}

