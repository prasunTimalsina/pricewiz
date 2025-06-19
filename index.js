import { scrapeHamrobazaar } from './hamrobazar.js';
import { scrapeDaraz } from './daraz.js';
import fs from 'fs';

(async () => {
  const query = 'fan';
  console.time('Total time');
  //const Durl = `https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${query}`;
  const Durl = `https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${query}`;
  const Hurl = `https://hamrobazaar.com/search/product?q=${query}`;


  const hamroPromise = (async () => {
    console.time('Hamrobazaar time');
    const products = await scrapeHamrobazaar(Hurl);
    const output = products.map((item, i) => (
      `\nSite: ${item.site}\nProduct ${i + 1}\nTitle: ${item.title}\nPrice: ${item.price}\nDescription: ${item.description}\nImage: ${item.img}\nLink: ${item.href}\n`
    )).join('\n');
    fs.writeFileSync('hamroBazar.txt', output, 'utf-8');
    console.timeEnd('Hamrobazaar time');
  })();

  const darazPromise = (async () => {
    console.time('Daraz time');
    const products = await scrapeDaraz(Durl);
    const output = products.map((item, i) => (
      `\nSite: ${item.site}\nProduct ${i + 1}\nTitle: ${item.title}\nPrice: ${item.price}\nImage: ${item.img}\nLink: ${item.href}\n`
    )).join('\n');
    fs.writeFileSync('daraz.txt', output, 'utf-8');
    console.timeEnd('Daraz time');
  })();

  await Promise.all([hamroPromise, darazPromise]);

  console.timeEnd('Total time');
})();


