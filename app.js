const bodyParser = require('body-parser'),
      mongoose  = require('mongoose'),
      express   = require('express'),
      app       = express()
// ==============================================================
//                        App Config
// ==============================================================
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
// ==============================================================
//                     Mongoose/Model Config
// ==============================================================
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => { console.log(`DB error: ${err}`) })

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
})

const Blog = mongoose.model('Blog', blogSchema)
// ==============================================================
//                        RESTful Routes
// ==============================================================
app.get('/', (req, res)=>{
  res.redirect('/blogs')
})

app.get('/blogs', (req, res)=>{
  Blog.find({}, (err, blogs) => {
    err ? console.log(`error: ${err}`) : res.render('index', {blogs: blogs})
  })
})

app.get('/blogs/new', (req, res)=>{
  res.render('new')
})

app.get('/blogs/:id', (req, res)=>{
  Blog.findById(req.params.id, (err, foundBlog) => {
    err ? res.redirect('/blogs') : res.render('show', {blog: foundBlog})
  })
})

app.post('/blogs', (req, res)=>{
  Blog.create(req.body.blog, (err, newBlog) => {
    err ? res.render('new') : res.redirect('/blogs')
  })
})

// ==============================================================
//                           Start App
// ==============================================================
app.listen(3000, ()=>{ console.log('Server is running and available at http://localhost:3000') })