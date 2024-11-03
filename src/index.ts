import fs from 'fs';
import path from 'path'
import { Command } from 'commander';
import { gatherLyrics } from './lyrics';
import { readCookie } from './cookie';

const program = new Command();

program
  .name('get-spotify-lyrics')
  .description('CLI tool to get lyrics from Spotify')
  .argument('<track-url>', 'Spotify track URL')
  .argument('<cookie-file-path>', 'Path to the cookie file')
  .argument('<data-directory>', 'Path to the data directory')
  .action(async (trackUrl: string, cookiePath: string, dataDirectory: string) => {
    try {
      const cookie = await readCookie(path.resolve(cookiePath))
      const s = trackUrl.split(/[?#]/)[0].split("/");
      const trackId = s[s.length - 1];
      const lyricsResult = await gatherLyrics(trackId, cookie);
      if (lyricsResult == undefined) process.exit(0);
      console.log(lyricsResult)
      const lyricsPath = path.join(dataDirectory, `${trackId}-${lyricsResult.trackName}.txt`)
      fs.writeFileSync(lyricsPath, lyricsResult.verses.join("\n"));
      console.log(`Lyrics for ${trackId} saved to ${lyricsPath}`);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
    }
  });

program.parse(process.argv);
