import { scrapeHamrobazaar } from './hamrobazar.js';
import { scrapeHamrobazaarPrice } from './hamrobazar.js';
import { scrapeDaraz } from './daraz.js';
import { scrapeIiti } from './itti.js';
import fs from 'fs';

(async () => {
  const query = 'keyboard';
  console.time('Total time');

  const lowPrice = 100
  const highPrice = 1000

  const Iurl = `https://itti.com.np/search/result?q=${query}&category_type=search`;
  const Durl = `https://www.daraz.com.np/catalog/?q=${query}&price=${lowPrice}-${highPrice}`;
  const Hurl = `https://hamrobazaar.com/search/product?q=${query}`;
  const Furl = `https://foodmandu.com/Restaurant/Index?q=${query}&k=restaurant&cty=1`;


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
    console.timeEnd('Daraz time');
  })();

  const ittiPromise = (async () => {
    console.time('Itti time');
    const products = await scrapeIiti(Iurl);
    console.timeEnd('Itti time');
  })();

  await Promise.all([hamroPromise, darazPromise, ittiPromise ]);

  console.timeEnd('Total time');
})();

