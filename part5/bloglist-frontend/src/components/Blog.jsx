import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, removable }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const increaseLikes = (event) => {
    event.preventDefault()
    const update = { ...blog, likes: blog.likes + 1 }
    updateBlog(update)
  }

  const remove = (event) => {
    event.preventDefault()
    removeBlog(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeBtnStyle = {
    color: 'white',
    backgroundColor: 'blue',
    display: (removable ? '' : 'none')
  }

  if (showDetails) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleShowDetails}>hide</button><br/>
        {blog.url}<br/>
        likes {blog.likes} <button onClick={increaseLikes}>like</button><br/>
        {blog.user.name}<br/>
        <button style={removeBtnStyle} onClick={remove}>remove</button>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleShowDetails}>view</button>
      </div>
    )
  }
}

export default Blog