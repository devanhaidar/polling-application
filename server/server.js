import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// File paths
const categoriesPath = join(__dirname, 'data', 'categories.json')
const votesPath = join(__dirname, 'data', 'votes.json')

// Helper functions untuk read/write files
const readCategories = () => {
  try {
    if (!existsSync(categoriesPath)) {
      writeFileSync(categoriesPath, JSON.stringify([], null, 2))
      return []
    }
    const data = readFileSync(categoriesPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading categories:', error)
    return []
  }
}

const writeCategories = (categories) => {
  try {
    writeFileSync(categoriesPath, JSON.stringify(categories, null, 2))
    return true
  } catch (error) {
    console.error('Error writing categories:', error)
    return false
  }
}

const readVotes = () => {
  try {
    if (!existsSync(votesPath)) {
      writeFileSync(votesPath, JSON.stringify({}, null, 2))
      return {}
    }
    const data = readFileSync(votesPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading votes:', error)
    return {}
  }
}

const writeVotes = (votes) => {
  try {
    writeFileSync(votesPath, JSON.stringify(votes, null, 2))
    return true
  } catch (error) {
    console.error('Error writing votes:', error)
    return false
  }
}

// Initialize votes structure if needed
const initializeVotes = () => {
  const votes = readVotes()
  const categories = readCategories()
  let updated = false

  categories.forEach(category => {
    if (!votes[category.id]) {
      votes[category.id] = {}
      category.candidates.forEach(candidate => {
        votes[category.id][candidate] = 0
      })
      updated = true
    } else {
      // Ensure all candidates have vote counts
      category.candidates.forEach(candidate => {
        if (votes[category.id][candidate] === undefined) {
          votes[category.id][candidate] = 0
          updated = true
        }
      })
    }
  })

  if (updated) {
    writeVotes(votes)
  }
}

// Initialize on startup
initializeVotes()

// API Routes

// GET /api/categories - Get all categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = readCategories()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// GET /api/results - Get all results
app.get('/api/results', (req, res) => {
  try {
    const votes = readVotes()
    const categories = readCategories()
    
    const results = categories.map(category => {
      const categoryVotes = votes[category.id] || {}
      const candidates = category.candidates.map(candidate => ({
        name: candidate,
        count: categoryVotes[candidate] || 0
      })).sort((a, b) => b.count - a.count)
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        categoryIcon: category.icon,
        candidates
      }
    })
    
    res.json(results)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' })
  }
})

// GET /api/results/:categoryId - Get results for specific category
app.get('/api/results/:categoryId', (req, res) => {
  try {
    const { categoryId } = req.params
    const votes = readVotes()
    const categories = readCategories()
    
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    const categoryVotes = votes[categoryId] || {}
    const candidates = category.candidates.map(candidate => ({
      name: candidate,
      count: categoryVotes[candidate] || 0
    })).sort((a, b) => b.count - a.count)
    
    res.json({
      categoryId: category.id,
      categoryName: category.name,
      categoryIcon: category.icon,
      candidates
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category results' })
  }
})

// POST /api/vote - Submit a vote
app.post('/api/vote', (req, res) => {
  try {
    const { categoryId, candidateName } = req.body
    
    if (!categoryId || !candidateName) {
      return res.status(400).json({ error: 'categoryId and candidateName are required' })
    }
    
    const votes = readVotes()
    const categories = readCategories()
    
    // Validate category exists
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    // Validate candidate exists in category
    if (!category.candidates.includes(candidateName)) {
      return res.status(400).json({ error: 'Candidate not found in category' })
    }
    
    // Initialize category votes if needed
    if (!votes[categoryId]) {
      votes[categoryId] = {}
    }
    
    // Initialize candidate votes if needed
    if (votes[categoryId][candidateName] === undefined) {
      votes[categoryId][candidateName] = 0
    }
    
    // Increment vote
    votes[categoryId][candidateName] += 1
    
    // Save votes
    if (writeVotes(votes)) {
      res.json({ 
        success: true, 
        message: 'Vote submitted successfully',
        votes: votes[categoryId]
      })
    } else {
      res.status(500).json({ error: 'Failed to save vote' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit vote' })
  }
})

// PUT /api/categories - Update categories
app.put('/api/categories', (req, res) => {
  try {
    const { categories } = req.body
    
    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: 'categories must be an array' })
    }
    
    // Validate structure
    for (const category of categories) {
      if (!category.id || !category.name || !Array.isArray(category.candidates)) {
        return res.status(400).json({ error: 'Invalid category structure' })
      }
    }
    
    if (writeCategories(categories)) {
      // Reinitialize votes structure
      initializeVotes()
      res.json({ success: true, message: 'Categories updated successfully' })
    } else {
      res.status(500).json({ error: 'Failed to update categories' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update categories' })
  }
})

// GET /api/votes - Get all votes (for admin)
app.get('/api/votes', (req, res) => {
  try {
    const votes = readVotes()
    res.json(votes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch votes' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PMI Awards 2025 API is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`)
})

