import axios from 'axios'
import * as cheerio from 'cheerio'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')

  const books = []

  try {
    const homepageUrl = `https://books.toscrape.com/index.html`
    const res = await axios.get(homepageUrl)
    const $ = cheerio.load(res.data)

    let matchedCategoryPath = null

    // Loop through all genre links
    $('.side_categories ul li ul li a').each(function () {
      const href = $(this).attr('href') // example: 'catalogue/category/books/mystery_3/index.html'
      const parts = href.split('/')
      const categoryWithId = parts[parts.length - 2] // e.g., 'mystery_3'
      const [name] = categoryWithId.split('_')

      if (name.toLowerCase() === query.toLowerCase()) {
        matchedCategoryPath = categoryWithId
      }
    })

    if (!matchedCategoryPath) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
      })
    }

    const categoryUrl = `https://books.toscrape.com/catalogue/category/books/${matchedCategoryPath}/index.html`
    const categoryRes = await axios.get(categoryUrl)
    const $$ = cheerio.load(categoryRes.data)

    $$('.product_pod').each(function () {
      const title = $$(this).find('h3 a').attr('title')
      const imgSrc = $$(this).find('img').attr('src')
      const image = 'https://books.toscrape.com/' + imgSrc.replace('../', '')

      books.push({ title, image })
    })

    return new Response(JSON.stringify(books), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error fetching book data:', err)
    return new Response(JSON.stringify({ error: 'Failed to fetch book data' }), {
      status: 500,
    })
  }
}
