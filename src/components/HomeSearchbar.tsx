'use client';

import * as React from "react";
import SearchBar from './searchbar';
import { AuroraBackground } from './ui/aurora-background';
import {
  Carousel,
  CarouselContent,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";


function HomeSearchbar() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <div className='w-full flex justify-center dark'>
      <AuroraBackground className='h-[400px] w-[1400px] rounded-2xl z-0'>
        <div className='flex justify-center w-full z-10 px-3'>
          <div className="w-[500px] text-white">
            <div className="text-3xl font-bold mb-10">
              <p >
                Css shall be fixed by my other friends
              </p>
              <p>
                and for time i have less
              </p>
              <p>
                as for font you shall use krona one
              </p>
            </div>
            <SearchBar />
          </div>
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-xs"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              <img src="https://pngimg.com/uploads/iphone16/iphone16_PNG36.png" />
              <img src="https://pngfre.com/wp-content/uploads/macbook-14-1.png" />
              <img src="https://pngimg.com/uploads/iphone16/iphone16_PNG36.png" />
              <img src="https://pngfre.com/wp-content/uploads/macbook-14-1.png" />
            </CarouselContent>
          </Carousel>
        </div>

      </AuroraBackground >
    </div>
  );
}

export default HomeSearchbar;
