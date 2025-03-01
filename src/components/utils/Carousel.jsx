import PropTypes from "prop-types";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

const Carousel = ({ cards }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
      };

      // Check immediately on init and selection
      emblaApi.on("select", onSelect);
      emblaApi.on("init", onSelect);
      onSelect(); // Ensure initial check is performed after setup

      return () => {
        emblaApi.off("select", onSelect);
        emblaApi.off("init", onSelect);
      };
    }
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="flex items-center justify-center w-full">
      {/* Scroll Prev Button - always rendered, visibility controlled */}
      <button
        className={`text-primary ${!canScrollPrev ? "invisible" : ""}`}
        onClick={scrollPrev}
        disabled={!emblaApi}
      >
        <IoIosArrowBack size={24} />
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden w-full px-2" ref={emblaRef}>
        <div className="flex items-center">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] p-2"
            >
              {card}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Next Button - always rendered, visibility controlled */}
      <button
        className={`text-primary ${!canScrollNext ? "invisible" : ""}`}
        onClick={scrollNext}
        disabled={!emblaApi}
      >
        <IoIosArrowForward size={24} />
      </button>
    </div>
  );
};

Carousel.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default Carousel;
