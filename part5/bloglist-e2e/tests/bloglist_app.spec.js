const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

describe('Bloglist app', () => {

  beforeEach(async ({ page, request }) => {
    // empty db
    await request.post('/api/testing/reset')
    // create two test users (to check removal of blogs from another user)
    await request.post('api/users', {
      data: {
        name: "Ben Kingsley",
        username: "benk",
        password: "test1234"
      }
    })
    await request.post('/api/users', {
      data: {
        name: "Josh Homme",
        username: "josh",
        password: "1234test"
      }
    })
    // open start page
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Login to application')).toBeVisible()
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      // mock user interaction
      await page.getByLabel('Username').fill('benk')
      await page.getByLabel('Password').fill('test1234')
      await page.getByRole('button', { name: 'Login' }).click()
      // check displayed elements
      await expect(page.getByText('Ben Kingsley is logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Create new blog '})).toBeVisible()
      await expect(page.getByText('blogs')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // mock user interaction
      await page.getByLabel('Username').fill('benk')
      await page.getByLabel('Password').fill('wrong')
      await page.getByRole('button', { name: 'Login' }).click()
      // check displayed elements
      await expect(page.getByText('Login failed, wrong credentials')).toBeVisible()
      await expect(page.locator('.error')).toContainText('wrong credentials')
      await expect(page.getByText('Ben Kingsley is logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {

    beforeEach(async ({ page }) => {
      // login
      await page.getByLabel('Username').fill('benk')
      await page.getByLabel('Password').fill('test1234')
      await page.getByRole('button', { name: 'Login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      const testBlog = {
        title: 'Syntactic Structures',
        author: 'Noam Chomsky',
        url: 'ISBN 90-279-3385-5'
      }
      // create blog
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByLabel('title').fill(testBlog.title)
      await page.getByLabel('author').fill(testBlog.author)
      await page.getByLabel('url').fill(testBlog.url)
      await page.getByRole('button', { name: 'Create'}).click()
      // ensure new blog is displayed under blogs section
      await expect(page.getByText('blogs').locator('..').getByText(`${testBlog.title} ${testBlog.author}`)).toBeVisible()
    })

    describe('and a blog exists', () => {

      beforeEach(async ({ page, request }) => {
        // create blog
        const testBlog = {
          title: 'Syntactic Structures',
          author: 'Noam Chomsky',
          url: 'ISBN 90-279-3385-5'
        }
        await page.getByRole('button', { name: 'Create new blog' }).click()
        await page.getByLabel('title').fill(testBlog.title)
        await page.getByLabel('author').fill(testBlog.author)
        await page.getByLabel('url').fill(testBlog.url)
        await page.getByRole('button', { name: 'Create'}).click()
      })

      test('a blog can be liked', async ({ page }) => {
        // get specific blog entry
        const blogElement = await page.getByText('blogs').locator('..').getByText('Syntactic Structures Noam Chomsky')
        // show details and click like
        await blogElement.getByRole('button', { name: 'view' }).click()
        await blogElement.getByRole('button', { name: 'like' }).click()
        // check result
        await expect(blogElement).toContainText('likes 1')
      })

      test('a blog can be removed', async ({ page }) => {
        // accept confirmation dialog (see https://deepshah201.medium.com/playwright-handling-alerts-3daebf3b7392)
        page.on('dialog', async (dialog) => {
          expect(dialog.type()).toContain('confirm')
          expect(dialog.message()).toContain('Remove the blog')
          await dialog.accept()
        })
        // get specific blog entry
        const blogElement = await page.getByText('blogs').locator('..').getByText('Syntactic Structures Noam Chomsky')
        // show details and click like
        await blogElement.getByRole('button', { name: 'view' }).click()
        await blogElement.getByRole('button', { name: 'remove' }).click()
        // check result
        await expect(blogElement).not.toBeVisible()
      })
    })
  })

  describe('When two users created blogs', () => {

    beforeEach(async ({ page }) => {
      // create blog with one user
      await helper.loginWith(page, "benk", "test1234")
      await helper.createBlog(page, helper.testBlogOne)
      await helper.logout(page)
      // create blog with another user
      await helper.loginWith(page, "josh", "1234test")
      await helper.createBlog(page, helper.testBlogTwo)
      await helper.logout(page)
    })

    test('remove button in a blog created by himself is visible to user', async ({ page }) => {
      // login
      await helper.loginWith(page, "benk", "test1234")
      // search blog element
      const blogOneElement = page.getByText('blogs').locator('..').getByText(`${helper.testBlogOne.title} ${helper.testBlogOne.author}`)
      // expand element
      await blogOneElement.getByRole('button', { name: 'view' }).click()
      // check on remove btn
      await expect(blogOneElement.getByRole('button', { name: 'remove' })).toBeVisible()
    })

    test('remove button in a blog created by another user is hidden', async ({ page }) => {
      // login
      await helper.loginWith(page, "benk", "test1234")
      // search blog element
      const blogTwoElement = page.getByText('blogs').locator('..').getByText(`${helper.testBlogTwo.title} ${helper.testBlogTwo.author}`)
      // expand element
      await blogTwoElement.getByRole('button', { name: 'view' }).click()
      // check on remove btn
      await expect(blogTwoElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })

  describe('When multiple blogs with different like count exist', () => {

    beforeEach(async ({ page }) => {
      // create blog with one user
      await helper.loginWith(page, "benk", "test1234")
      // create blog and increase likes to 1
      await helper.createBlog(page, helper.testBlogOne)
      await helper.increaseLikes(page, helper.testBlogOne)
      // create blog and increase likes to 5
      await helper.createBlog(page, helper.testBlogTwo)
      for (let i = 0; i < 5; i++) {
        await helper.increaseLikes(page, helper.testBlogTwo)
      }
      await helper.logout(page)
      // create blog with another user
      await helper.loginWith(page, "josh", "1234test")
      // create blog and increase likes to 3
      await helper.createBlog(page, helper.testBlogThree)
      for (let i = 0; i < 3; i++) {
        await helper.increaseLikes(page, helper.testBlogThree)
      }
      // increase likes of one by other user
      await helper.increaseLikes(page, helper.testBlogOne)
      await helper.logout(page)
    })

    test('blogs should be ordered descending by like count', async ({ page }) => {
      await helper.loginWith(page, "benk", "test1234")

      // get list of all blogs
      const blogs = page.getByRole('button', { name: 'view'}).locator('..')

      // check if nth suits the order by checking content of nth blog
      // order should be: testBlogTwo -> testBlogThree -> testBlogOne
      // check if according content is given and content of other blogs is not in nth element
      // first element should be testBlogTwo
      await expect(blogs.nth(0)).toContainText(`${helper.testBlogTwo.title} ${helper.testBlogTwo.author}`)
      await expect(blogs.nth(0)).not.toContainText(`${helper.testBlogOne.title} ${helper.testBlogOne.author}`)
      await expect(blogs.nth(0)).not.toContainText(`${helper.testBlogThree.title} ${helper.testBlogThree.author}`)
      // second element should be testBlogThree
      await expect(blogs.nth(1)).toContainText(`${helper.testBlogThree.title} ${helper.testBlogThree.author}`)
      await expect(blogs.nth(1)).not.toContainText(`${helper.testBlogOne.title} ${helper.testBlogOne.author}`)
      await expect(blogs.nth(1)).not.toContainText(`${helper.testBlogTwo.title} ${helper.testBlogTwo.author}`)
      // third element should be testBlogOne
      await expect(blogs.nth(2)).toContainText(`${helper.testBlogOne.title} ${helper.testBlogOne.author}`)
      await expect(blogs.nth(2)).not.toContainText(`${helper.testBlogTwo.title} ${helper.testBlogTwo.author}`)
      await expect(blogs.nth(2)).not.toContainText(`${helper.testBlogThree.title} ${helper.testBlogThree.author}`)
    })
  })
})