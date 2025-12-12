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

const testBlogThree = {
  title: 'De la grammatologie',
  author: 'Jaques Derrida',
  url: 'ISBN 2-7073-0012-8'
}

const loginWith = async (page, username, password) => {
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, blog) => {
  // only if logged in
  await page.getByRole('button', { name: 'Create new blog' }).click()
  await page.getByLabel('title').fill(blog.title)
  await page.getByLabel('author').fill(blog.author)
  await page.getByLabel('url').fill(blog.url)
  await page.getByRole('button', { name: 'Create'}).click()
  await page.getByRole('button', { name: 'cancel' }).click()
}

const logout = async (page) => {
  // only if logged in 
  await page.getByRole('button', { name: 'Logout'}).click()
}

const increaseLikes = async (page, blog) => {
  // only if logged in
  // get specific blog entry
  const blogElement = await page.getByText('blogs').locator('..').getByText(blog.title)
  // show details and click like
  await blogElement.getByRole('button', { name: 'view' }).click()
  await blogElement.getByRole('button', { name: 'like' }).click()
  await blogElement.getByRole('button', { name: 'hide' }).click()
}

export { loginWith, createBlog, increaseLikes, logout, testBlogOne, testBlogTwo, testBlogThree }