"use client";

import Card from "./card";

const FeaturedProducts = [
  {
    "site": "Hukut",
    "href": "https://hukut.com/iphone-13-price-in-nepal",
    "img": "https://cdn.hukut.com/Apple%20iPhone%2013%20Red2.webp",
    "title": "Apple iPhone 13",
    "price": "74099"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/iphone-14-price-in-nepal",
    "img": "https://cdn.hukut.com/iphone_14_red.webp",
    "title": "Apple iPhone 14",
    "price": "89299"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/iphone-15-price-in-nepal",
    "img": "https://cdn.hukut.com/iPhone%2015%20pink(3).webp",
    "title": "Apple iPhone 15",
    "price": "104100"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/apple-iphone-16e",
    "img": "https://cdn.hukut.com/Apple-iphone-16e-Price-in-Nepal.png1744176699046",
    "title": "Apple iPhone 16e",
    "price": "117100"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/iphone-16",
    "img": "https://cdn.hukut.com/apple-iphone-16-ultramarine.webp1728295065216",
    "title": "Apple iPhone 16",
    "price": "130200"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/iphone-16-plus",
    "img": "https://cdn.hukut.com/apple-iphone-16-ultramarine.webp1728296274693",
    "title": "Apple iPhone 16 Plus",
    "price": "149600"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/iphone-16-pro",
    "img": "https://cdn.hukut.com/iphone-16-pro-desert-titanium.webp1728297752349",
    "title": "Apple iPhone 16 Pro",
    "price": "168700"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/iphone-16-pro-max",
    "img": "https://cdn.hukut.com/iphone-16-pro-max-desert-titanium.webp1728298969978",
    "title": "Apple iPhone 16 Pro Max",
    "price": "197000"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/nothing-phone-(3)",
    "img": "https://cdn.hukut.com/nothing-phone-(3)-white.webp1751630405457",
    "title": "Nothing Phone (3)",
    "price": "109999"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/nothing-phone-(3a)",
    "img": "https://cdn.hukut.com/Nothing-Phone-3a%20(1).webp1744872875299",
    "title": "Nothing Phone (3a)",
    "price": "55999"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/nothing-cmf-phone-2-pro",
    "img": "https://cdn.hukut.com/nothing-cmf-phone-2-pro-orange.webp1750135743580",
    "title": "Nothing CMF Phone 2 Pro",
    "price": "34999"
  },
  {
    "site": "Hukut",
    "href": "https://hukut.com/nothing-phone-(2a)-plus",
    "img": "https://cdn.hukut.com/nothing-phone-2a-plus.webp1739965935798",
    "title": "Nothing Phone (2a) Plus",
    "price": "54000"
  }
];


export default function Featured() {
  //there will be a array here which will call the db for featured products
  //the loop is the same
  //component would be a db card 

  return (
    <>
      <div>Featured Products</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {FeaturedProducts.map((product, index) => (
          <Card key={index} product={product} />
        ))}
      </div>
    </>
  );
}
