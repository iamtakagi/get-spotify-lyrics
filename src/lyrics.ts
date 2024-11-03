import puppeteer from 'puppeteer';
import { CookieParam } from 'puppeteer';

const baseUrl = 'https://open.spotify.com/track';
const lyricsSelector = 'xt5C47eHPYNiriMJxGnC';

export interface LyricsResult {
  trackName: string,
  verses: string[]
}

export const gatherLyrics = async (trackId: string, cookie: CookieParam[]): Promise<LyricsResult | undefined> => {
  const url = `${baseUrl}/${trackId}`;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();

    await page.setCookie(...cookie);
    await page.goto(url);

    try {
      await page.waitForSelector(`.${lyricsSelector}`, { timeout: 8000 });
      const trackName = (await page.title()).replace(/ - song and lyrics by .*?\s*\|\s*Spotify$/, '').trim();
      const verses = await page.$$eval(`.${lyricsSelector}`, lyrics => {
        return lyrics
          .map(verses => (verses as HTMLElement).innerText.trim())
          .filter(verse => verse.length > 0 && verse !== '' && verse !== '♪');
      });
      await browser.close();
      return {
        trackName,
        verses
      }
    } catch (error) {
      console.log('no found lyrics');
      browser.close();
      return undefined
    }
  } catch (error) {
    throw new Error('puppeteer error');
  }
};