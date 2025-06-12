import { scrapeHamrobazaar } from './hamrobazar.js';

(async () => {
  const query = 'fan';
  const products = await scrapeHamrobazaar(query);

  products.forEach((item, index) => {
    console.log(`\nProduct ${index + 1}`);
    console.log(`Title: ${item.title}`);
    console.log(`Price: ${item.price}`);
    console.log(`Description: ${item.description}`);
    console.log(`Image: ${item.img}`);
    console.log(`Link: ${item.href}`);
  });
})();

