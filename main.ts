import {chromium} from 'playwright'

interface Video {
  id: string
  url: string
  detail: VideoDetail
}

interface VideoDetail {
  '@type': string
  name: string
  description: string
  genre: string
  author: string
  thumbnailUrl: string[]
  uploadDate: string
  publication: VideoPublication
}

interface VideoPublication {
  '@type': string
  isLiveBroadcast: boolean,
  startDate: Date,
  endDate: Date,
}

(async () => {
  console.time('main');
  await main()
  console.timeEnd('main');
})()

async function main() {
  const browser = await chromium.launch({
    headless: true,
    slowMo: 500,
  });

  const page = await browser.newPage();
  await page.goto('https://www.youtube.com/user/Youjinboy/videos?view=0&sort=dd&flow=grid');
  const videoUrls = await page.evaluate(getVideoUrlsFromDocument)
  const videos: Video[] = []
  for (const url of videoUrls) {
    await page.goto(url)
    const [_, id] = url.split('https://www.youtube.com/watch?v=')
    const detail = await page.evaluate(getVideoDetailFromDocument)
    if (detail) {
      videos.push({id, url, detail})
    }
  }
  console.log(videos)
  await browser.close();
}

function getVideoUrlsFromDocument() {
  const anchors = document.querySelectorAll('a')
  const urls = Array.from(anchors)
    .map((a) => a.href)
    .filter((href) => href.includes('watch?v='))
  return Array.from(new Set(urls)) // to unique
}

function getVideoDetailFromDocument(): VideoDetail | null {
  try {
    const { innerText } = document.getElementById('scriptTag')
    return JSON.parse(innerText) as VideoDetail
  } catch (e) {
    console.error(e)
    return null
  }
}
