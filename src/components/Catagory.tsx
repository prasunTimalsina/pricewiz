//import React from "react";
//
//import {
//  IconArrowWaveRightUp,
//  IconBoxAlignRightFilled,
//  IconBoxAlignTopLeft,
//  IconClipboardCopy,
//  IconFileBroken,
//  IconSignature,
//  IconTableColumn,
//} from "@tabler/icons-react";
//import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
//
//export default function Catagory() {
//  return (
//    <>
//      <h2 className="text-4xl md:text-6xl font-bold text-center mb-6 text-gray-900 dark:text-white">
//        Categories
//      </h2>
//      <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto">
//        Discover real-time deals from trusted online stores
//      </p>
//      <BentoGrid className="max-w-4xl mx-auto">
//        {items.map((item, i) => (
//          <BentoGridItem
//            key={i}
//            title={item.title}
//            description={item.description}
//            header={item.header}
//            icon={item.icon}
//            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
//          />
//        ))}
//      </BentoGrid>
//    </>
//  );
//}
//const Skeleton = () => (
//  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
//);
//const items = [
//  {
//    title: "The Dawn of Innovation",
//    description: "Explore the birth of groundbreaking ideas and inventions.",
//    header: <Skeleton />,
//    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
//  },
//  {
//    title: "The Digital Revolution",
//    description: "Dive into the transformative power of technology.",
//    header: <Skeleton />,
//    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
//  },
//  {
//    title: "The Art of Design",
//    description: "Discover the beauty of thoughtful and functional design.",
//    header: <Skeleton />,
//    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
//  },
//  {
//    title: "The Power of Communication",
//    description:
//      "Understand the impact of effective communication in our lives.",
//    header: <Skeleton />,
//    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
//  },
//  {
//    title: "The Pursuit of Knowledge",
//    description: "Join the quest for understanding and enlightenment.",
//    header: <Skeleton />,
//    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
//  },
//  {
//    title: "The Joy of Creation",
//    description: "Experience the thrill of bringing ideas to life.",
//    header: <Skeleton />,
//    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
//  },
//  {
//    title: "The Spirit of Adventure",
//    description: "Embark on exciting journeys and thrilling discoveries.",
//    header: <Skeleton />,
//    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
//  },
//];
//
//

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

import Iphone from "../../public/iphone-16-black.png";

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
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />
);

const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    image: "https://www.pngmart.com/files/23/Gaming-Pc-PNG-Pic.png",
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    image: "https://www.pngmart.com/files/23/Gaming-Pc-PNG-Pic.png",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    image: "https://www.pngmart.com/files/23/Gaming-Pc-PNG-Pic.png",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Power of Communication",
    description: "Understand the impact of effective communication in our lives.",
    image: "https://www.pngmart.com/files/23/Gaming-Pc-PNG-Pic.png",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Pursuit of Knowledge",
    description: "Join the quest for understanding and enlightenment.",
    image: "https://www.pngmart.com/files/23/Gaming-Pc-PNG-Pic.png",
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Joy of Creation",
    description: "Experience the thrill of bringing ideas to life.",
    image: "https://www.pngmart.com/files/23/Gaming-Pc-PNG-Pic.png",
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Spirit of Adventure",
    description: "Embark on exciting journeys and thrilling discoveries.",
    image: "https://www.pngmart.com/files/23/Gaming-Pc-PNG-Pic.png",
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },
];

