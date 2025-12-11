import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Toggable from './components/Toggable'
import BlogForm from './components/BlogForm'
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

  const createNewBlog = async (blog) => {
    try {
      const created = await blogService.create(blog)
      setBlogs(blogs.concat(created))
      console.log('created', created)
      notify(`successfully created new blog ${created.title}`, 'hint')
    } catch {
      console.error('creation failed')
      notify('creation of new blog failed', 'error')
    }
  }

  const updateBlog = async (blog) => {
    try {
      const updated = await blogService.update(blog)
      console.log('updated', updated)
      // need to refresh
      const updatedBlogs = blogs.map(b => b.id === updated.id ? updated : b)
      console.log('updatedBlogs', updatedBlogs)
      setBlogs(updatedBlogs)
      notify(`successfully updated blog ${updated.title}`, 'hint')
    } catch {
      console.error('update failed')
      notify(`update of blog ${blog.title} failed`, 'error')
    }
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove the blog ${blog.title}?`)) {
      try {
        await blogService.remove(blog)
        // need to refresh
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notify(`successfully removed blog ${blog.title}`, 'hint')
      } catch {
        console.error('removal failed')
        notify(`removal of blog ${blog.title} failed`, 'error')
      }
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

  const sortedBlogs = () => {
    const sorted = [ ...blogs ]
      .sort((a, b) => a.likes < b.likes ? 1 : -1)
    return sorted
  }

  if (!user) {
    return (
      <div>
        <Notification notification={notification}/>
        <h2>Login to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              Username
              <input type='text' value={username} onChange={({ target }) => setUsername(target.value)}></input>
            </label>
          </div>
          <div>
            <label>
              Password
              <input type='password' value={password} onChange={({ target }) => setPassword(target.value)}></input>
            </label>
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
      <Toggable buttonLabel='Create new blog'>
        <BlogForm createNewBlog={createNewBlog}/>
      </Toggable>
      <div>
        <h2>blogs</h2>
        {sortedBlogs().map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} removable={user.username === blog.user.username}/>
        )}
      </div>
    </div>
  )
}

export default App