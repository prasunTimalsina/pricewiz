import { scrapeHamrobazaar } from './hamrobazar.js';
import {  scrapeDaraz } from './daraz.js';
import fs from 'fs';

(async () => {
  const query = 'fan';
  const products = await scrapeDaraz(query);
  //const products = await scrapeHamrobazaar(query);
  //const lines = products.map((item, index) => {
  //  return (
  //    `\nSite: ${item.site}\n` +
  //    `Product ${index + 1}\n` +
  //    `Title: ${item.title}\n` +
  //    `Price: ${item.price}\n` +
  //    `Description: ${item.description}\n` +
  //    `Image: ${item.img}\n` +
  //    `Link: ${item.href}\n`
  //  );
  //});
  //
  //const output = lines.join('\n');
  //fs.writeFileSync('parse.html', output, 'utf-8');
})();

