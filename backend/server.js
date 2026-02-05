const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')
const cors = require('cors')

dotenv.config()

const app = express()   // ✅ app defined before use
const PORT = process.env.PORT || 3000
const DB_NAME = process.env.DB_NAME
const MONGO_URI = process.env.MONGO_URI

app.use(bodyParser.json())

// ✅ keep only ONE cors and configure it
app.use(cors({
  origin: "https://pass-op-your-own-password-manager-rho.vercel.app",
  methods: ["GET","POST","DELETE","PUT"],
  credentials: true
}))

const client = new MongoClient(MONGO_URI)

let db

// Mongo connection
async function connectDB() {
  try {
    await client.connect()
    db = client.db(DB_NAME)
    console.log("✅ MongoDB connected")
  } catch (err) {
    console.error("❌ MongoDB connection failed", err)
    process.exit(1)
  }
}
connectDB()

// ROUTES
app.get('/', async (req, res) => {
  const passwords = await db.collection('passwords').find({}).toArray()
  res.json(passwords)
})

app.post('/', async (req, res) => {
  const password = req.body
  const result = await db.collection('passwords').insertOne(password)
  res.json({ success: true, result })
})

app.delete('/', async (req, res) => {
  const { id } = req.body
  const result = await db.collection('passwords').deleteOne({ id })
  res.json({ success: true, result })
})

// SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
