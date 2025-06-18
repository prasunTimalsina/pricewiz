import { scrapeHamrobazaar } from './hamrobazar.js';
import { scrapeDaraz } from './daraz.js';
import fs from 'fs';

(async () => {
  const query = 'chocolate musk attar';
  console.time('Total time');

  const hamroPromise = (async () => {
    console.time('Hamrobazaar time');
    const products = await scrapeHamrobazaar(query);
    const output = products.map((item, i) => (
      `\nSite: ${item.site}\nProduct ${i + 1}\nTitle: ${item.title}\nPrice: ${item.price}\nDescription: ${item.description}\nImage: ${item.img}\nLink: ${item.href}\n`
    )).join('\n');
    fs.writeFileSync('hamroBazar.txt', output, 'utf-8');
    console.timeEnd('Hamrobazaar time');
  })();

  const darazPromise = (async () => {
    console.time('Daraz time');
    const products = await scrapeDaraz(query);
    const output = products.map((item, i) => (
      `\nSite: ${item.site}\nProduct ${i + 1}\nTitle: ${item.title}\nPrice: ${item.price}\nImage: ${item.img}\nLink: ${item.href}\n`
    )).join('\n');
    fs.writeFileSync('daraz.txt', output, 'utf-8');
    console.timeEnd('Daraz time');
  })();

  await Promise.all([hamroPromise, darazPromise]);

  console.timeEnd('Total time');
})();

