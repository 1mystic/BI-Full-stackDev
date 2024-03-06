const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now }
});

// Create Post model
const Post = mongoose.model('Post', postSchema);

// Serve static files
app.use(express.static('public'));

// Parse request bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/posts', async (req, res) => {
  const posts = await Post.find({}).sort({ date: -1 });
  res.render('posts', { posts });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content });
  await post.save();
  res.redirect('/posts');
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});