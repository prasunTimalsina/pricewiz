//import { scrapeHamrobazaar } from './hamrobazar.js';
//import { scrapeHamrobazaarPrice } from './hamrobazar.js';
//import { scrapeDaraz } from './daraz.js';
//import fs from 'fs';
//
//(async () => {
//  const query = 'fan';
//  console.time('Total time');
//
//  const lowPrice = 100
//  const highPrice = 1000
//  const Durl = `https://www.daraz.com.np/catalog/?q=fan&price=${lowPrice}-${highPrice}`;
//  const Hurl = `https://hamrobazaar.com/search/product?q=${query}`;
//
//
//  const hamroPromise = (async () => {
//    console.time('Hamrobazaar time');
//    const products = await scrapeHamrobazaar(Hurl);
//    const output = products.map((item, i) => (
//      `\nSite: ${item.site}\nProduct ${i + 1}\nTitle: ${item.title}\nPrice: ${item.price}\nDescription: ${item.description}\nImage: ${item.img}\nLink: ${item.href}\n`
//    )).join('\n');
//    fs.writeFileSync('hamroBazar.txt', output, 'utf-8');
//    console.timeEnd('Hamrobazaar time');
//  })();
//
//  const darazPromise = (async () => {
//    console.time('Daraz time');
//    const products = await scrapeDaraz(Durl);
//    const output = products.map((item, i) => (
//      `\nSite: ${item.site}\nProduct ${i + 1}\nTitle: ${item.title}\nPrice: ${item.price}\nImage: ${item.img}\nLink: ${item.href}\n`
//    )).join('\n');
//    fs.writeFileSync('daraz.txt', output, 'utf-8');
//    console.timeEnd('Daraz time');
//  })();
//
//  await Promise.all([hamroPromise, darazPromise]);
//
//  console.timeEnd('Total time');
//})();

import { scrapeIiti } from './iiti.js';

(async () => {
  const query = 'fan';
  console.time('Total time');

  const lowPrice = 100
  const highPrice = 1000
  const Iurl = `https://itti.com.np/search/result?q=${query}&category_type=search`;


  const hamroPromise = (async () => {
    console.time('IITI Time');
    const products = await scrapeIiti(Iurl);
    console.log(products)
    console.timeEnd('Hamrobazaar time');
  })();

  await Promise.all([scrapeIiti]);

  console.timeEnd('Total time');
})();
