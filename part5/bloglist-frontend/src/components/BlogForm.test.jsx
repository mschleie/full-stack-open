import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('create a blog with according properties', async () => {
  const testBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'Test URL',
  }
  // mock event handler function to create blog
  const createMock = vi.fn()
  // render component to test
  render(<BlogForm createNewBlog={createMock}/>)
  // input elements
  const titleInput = screen.getByLabelText('title')
  const authorInput = screen.getByLabelText('author')
  const urlInput = screen.getByLabelText('url')
  // submit button
  const createBtn = screen.getByText('Create')
  // mock user interaction
  const user = userEvent.setup()
  await user.type(titleInput, testBlog.title)
  await user.type(authorInput, testBlog.author)
  await user.type(urlInput, testBlog.url)
  await user.click(createBtn)
  // test if handler is called with according properties
  expect(createMock.mock.calls).toHaveLength(1)
  expect(createMock.mock.calls[0][0].title).toBe(testBlog.title)
  expect(createMock.mock.calls[0][0].author).toBe(testBlog.author)
  expect(createMock.mock.calls[0][0].url).toBe(testBlog.url)
})