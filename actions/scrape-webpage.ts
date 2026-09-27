import puppeteer from "puppeteer"
import { EmbeddingDocumentType } from "@/schema/tables/embedding-document";
import { chunkContent } from "./chunking";
import { createHash } from "@/lib/utils"
const pageUrls = [
  'https://www.zoho.com/',
  'https://www.zoho.com/en-in/crm/',
  'https://www.zoho.com/fsm/'
];




export async function scrapeWebpages() {
  try {
    console.log("Section 1: Scraping and chunking content from URLs")
    const recoards: EmbeddingDocumentType["create"][] = []
    for (let i = 0; i < pageUrls.length; i++) {
      const url = pageUrls[i]
      const content = await scrapePage(url)
      if (content) {
        const resultChunks = await chunkContent(content.text)
        for (const chunk of resultChunks) {
          recoards.push({
            text: chunk,
            source: url,
            sourceType: "url",
            chunkIndex: i,
            hash: createHash(chunk),
          })
        }
        console.log(`[INFO] embedded chunk ${i} content from ${resultChunks.length} chunks`)
      }
    }
    console.log("data loaded successfully.")
    return recoards
  }catch (error) {

    console.error('Error scraping webpages:', error);
    throw new Error("Failed to scrape data")
  }
}


const scrapePage = async (url: string) => {
  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "networkidle2" })
    const content = await page.evaluate(() => {
      document
        .querySelectorAll("script, style, nav, footer, header, noscript")
        .forEach((el) => el.remove())
      return {
        title: document.title,
        text: document.body.innerText.replace(/\s+/g, " ").trim(),
      }
    })
    await page.close()
    return content
  } catch (error) {
    console.error(`Error scraping page ${url}:`, error)
  } finally {
    await browser.close()
  }
}
