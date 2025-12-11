import { useState } from 'react'

const BlogForm = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    // create new Blog instance
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    // call passed App function to add blog via api
    props.createNewBlog(newBlog)
    // reset form lines
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title
            <input type='text' value={title} onChange={({ target }) => setTitle(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            author
            <input type='text' value={author} onChange={({ target }) => setAuthor(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            url
            <input type='text' value={url} onChange={({ target }) => setUrl(target.value)}></input>
          </label>
        </div>
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default BlogForm