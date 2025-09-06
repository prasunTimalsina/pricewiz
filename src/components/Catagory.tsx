"use client";

import React from "react";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

import { BentoGrid, BentoGridItem } from "./ui/bento-grid";

export default function Catagory() {
  return (
    <>
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Categories
      </h2>
      <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto">
        Discover real-time deals from trusted online stores
      </p>
      <BentoGrid className="max-w-4xl mx-auto">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            image={item.image}
            description={item.description}
            icon={item.icon}
            href={item.link}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </>
  );
}

const items = [
  {
    title: "Popular Products",
    description: "Most Clicked and viewed Products",
    image:
      "https://plus.unsplash.com/premium_photo-1720287601300-cf423c3d6760?q=80&w=2670&auto=format&fit=crop",
    icon: <IconClipboardCopy className="h-4 w-4 text-white" />,
    link: "product/popular",
  },
  {
    title: "Best Phones",
    description: "Dive into the transformative power of technology.",
    image:
      "https://images.unsplash.com/photo-1691073112675-9685bc6779bf?q=80&w=2670&auto=format&fit=crop",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    link: "/product/query?q=iphone",
  },
  {
    title: "Best Smart watches",
    description: "Discover the beauty of thoughtful and functional design.",
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=2727&auto=format&fit=crop",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    link: "/product/query?q=smartwatches",
  },
  {
    title: "TV's",
    description:
      "Understand the impact of effective communication in our lives.",
    image:
      "https://plus.unsplash.com/premium_photo-1681236323432-3df82be0c1b0?q=80&w=2670&auto=format&fit=crop",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    link: "/product/query?q=tv",
  },
  {
    title: "Popular Accessories",
    description: "Join the quest for understanding and enlightenment.",
    image:
      "https://plus.unsplash.com/premium_photo-1661304671477-37c77d0c6930?q=80&w=1470&auto=format&fit=crop",
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    link: "/product/query?q=tech%20accessories",
  },
  {
    title: "Gpu's",
    description: "Experience the thrill of bringing ideas to life.",
    image:
      "https://images.unsplash.com/photo-1624701928517-44c8ac49d93c?q=80&w=2670&auto=format&fit=crop",
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
    link: "/product/query?q=gpu",
  },
  {
    title: "Laptop's",
    description: "Embark on exciting journeys and thrilling discoveries.",
    image:
      "https://images.unsplash.com/photo-1680530033206-881e0a7e44b5?q=80&w=2670&auto=format&fit=crop",
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
    link: "/product/query?q=laptop",
  },
];
