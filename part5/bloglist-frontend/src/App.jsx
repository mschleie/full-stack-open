import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = (props) => {
  if (props.notification !== null) {
    console.log('message', props.notification.message)
    console.log('type', props.notification.type)
    return (
      <div className={props.notification.type}>
        <p>{props.notification.message}</p>
      </div>
    )
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])

  // user management
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // new blog creation
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // notification
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const loggedInUser = JSON.parse(loggedInUserJSON)
      setUser(loggedInUser)
      blogService.setToken(loggedInUser.token)
      notify('successfully logged in via localStorage', 'hint')
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Login with', username, password)

    try {
      const loginUser = await loginService.login({ username, password })
      setUser(loginUser)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedInUser', JSON.stringify(loginUser))
      blogService.setToken(loginUser.token)
      console.log('Login successfull')
      notify('Login successfull', 'hint')
    } catch {
      console.error('wrong credentials')
      notify('Login failed, wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    console.log('Logout')
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
    blogService.setToken(null)
    notify('logout successfull', 'hint')
  }

  const handleCreateNew = async (event) => {
    event.preventDefault()

    try {
      const newBlog = {
        'title': title,
        'author': author,
        'url': url
      }
      const created = await blogService.create(newBlog)
      setBlogs(blogs.concat(created))
      console.log('created', created)
      notify(`successfully created new blog ${created.title}`, 'hint')
    } catch {
      console.error('creation failed')
      notify('creation of new blog failed', 'error')
    }
  }

  const notify = (message, type) => {
    const notification = {
      message: message,
      type: type
    }
    setNotification(notification)
    setTimeout(() => setNotification(null), 5000)
  }

  if (!user) {
    return (
      <div>
        <Notification notification={notification}/>
        <h2>Login to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username</label>
            <input type='text' value={username} onChange={({ target }) => setUsername(target.value)}></input>
          </div>
          <div>
            <label>Password</label>
            <input type='password' value={password} onChange={({ target }) => setPassword(target.value)}></input>
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification}/>
      <div>
        <p>{user.name} is logged in</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        <h2>Create new</h2>
        <form onSubmit={handleCreateNew}>
          <div>
            <label>title</label>
            <input type='text' value={title} onChange={({ target }) => setTitle(target.value)}></input>
          </div>
          <div>
            <label>author</label>
            <input type='text' value={author} onChange={({ target }) => setAuthor(target.value)}></input>
          </div>
          <div>
            <label>url</label>
            <input type='text' value={url} onChange={({ target }) => setUrl(target.value)}></input>
          </div>
          <button type='submit'>Create</button>
        </form>
      </div>
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}

export default App