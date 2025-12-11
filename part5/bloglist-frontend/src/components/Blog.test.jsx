import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('display blogs title and author but no url and likes', () => {
  const testBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'Test URL',
    likes: 13,
    // do not define user here
  }

  const mockUpdate = vi.fn()
  const mockRemove = vi.fn()
  const removable = false

  render(<Blog blog={testBlog} updateBlog={mockUpdate} removeBlog={mockRemove} removable={removable}/>)

  // test fails if getByText does not find element
  const titleElement = screen.findByText('Test Blog')
  const authorElement = screen.findByText('Test Author')
  // but for sake of uniformity adding expect explicitely
  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  // use queryByText because no exception is thrown if not finding the element
  const urlElement = screen.queryByText('Test URL')
  const likesElement = screen.queryByDisplayValue('13')
  // here we need to check explicitely on not exisiting
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('display url and likes after clicking show button', async () => {
  const testBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'Test URL',
    likes: 13,
    user: {
      name: 'Test User',
      username: 'Test Username'
    }
  }

  const mockUpdate = vi.fn()
  const mockRemove = vi.fn()
  const removable = false

  render(<Blog blog={testBlog} updateBlog={mockUpdate} removeBlog={mockRemove} removable={removable}/>)

  // mock user interaction
  const user = userEvent.setup()
  const viewBtn = screen.getByText('view')
  await user.click(viewBtn)

  // test fails if getByText does not find element
  const titleElement = screen.findByText('Test Blog')
  const authorElement = screen.findByText('Test Author')
  const urlElement = screen.findByText('Test URL')
  const likesElement = screen.findByDisplayValue('13')
  // but for sake of uniformity adding expect explicitely
  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('clicking twice on likes button results in two increase calls', async () => {
  const testBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'Test URL',
    likes: 13,
    user: {
      name: 'Test User',
      username: 'Test Username'
    }
  }

  const mockUpdate = vi.fn()
  const mockRemove = vi.fn()
  const removable = false

  render(<Blog blog={testBlog} updateBlog={mockUpdate} removeBlog={mockRemove} removable={removable}/>)

  // mock user interaction
  const user = userEvent.setup()
  // show details
  const viewBtn = screen.getByText('view')
  await user.click(viewBtn)
  // click twice on like btn
  const likeBtn = screen.getByText('like')
  await user.click(likeBtn)
  await user.click(likeBtn)
  // check calls on mocked update function
  expect(mockUpdate.mock.calls).toHaveLength(2)
})