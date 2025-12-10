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
  )
}

export default BlogForm