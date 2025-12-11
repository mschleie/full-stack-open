const testBlogOne = {
  title: 'Syntactic Structures',
  author: 'Noam Chomsky',
  url: 'ISBN 90-279-3385-5'
}

const testBlogTwo = {
  title: 'Dialektik der Aufklärung',
  author: 'Max Horkheimer & Theodor W. Adorno',
  url: 'ISBN 3-596-27404-4'
}

const loginWith = async (page, username, password) => {
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'Create new blog' }).click()
  await page.getByLabel('title').fill(blog.title)
  await page.getByLabel('author').fill(blog.author)
  await page.getByLabel('url').fill(blog.url)
  await page.getByRole('button', { name: 'Create'}).click()
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'Logout'}).click()
}

export { loginWith, createBlog, logout, testBlogOne, testBlogTwo }