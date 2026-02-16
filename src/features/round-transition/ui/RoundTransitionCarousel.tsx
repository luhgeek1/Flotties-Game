import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Button } from "@/shared/components/ui/button"

const carouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
}

type RoundTransitionCarouselProps = {
  slides: ReadonlyArray<{ key: string; content: ReactNode }>
  index: number
  direction: number
  onPaginate: (direction: number) => void
  onSelect: (index: number) => void
  hideUi?: boolean
}

export function RoundTransitionCarousel({
  slides,
  index,
  direction,
  onPaginate,
  onSelect,
  hideUi = false,
}: RoundTransitionCarouselProps) {
  if (!slides.length) {
    return null
  }

  const safeIndex = index >= 0 && index < slides.length ? index : 0
  const currentSlide = slides[safeIndex] ?? slides[0]
  const hasMultipleSlides = slides.length > 1
  const canGoPrev = safeIndex > 0
  const canGoNext = safeIndex < slides.length - 1
  const controlsClassName = hideUi
    ? "opacity-0 pointer-events-none transition-opacity duration-200"
    : "opacity-100 transition-opacity duration-200"

  return (
    <div className="relative w-full max-w-2xl h-65 flex items-center justify-center mb-4">
      {hasMultipleSlides && canGoPrev ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={["absolute -left-6 sm:-left-12 z-10 shadow-sm", controlsClassName].join(" ")}
          onClick={() => onPaginate(-1)}
        >
          <ChevronLeft className="size-5" />
        </Button>
      ) : null}

      <div className="w-full h-full overflow-hidden relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide.key}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {currentSlide.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {hasMultipleSlides && canGoNext ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={["absolute -right-6 sm:-right-12 z-10 shadow-sm", controlsClassName].join(" ")}
          onClick={() => onPaginate(1)}
        >
          <ChevronRight className="size-5" />
        </Button>
      ) : null}

      {hasMultipleSlides ? (
        <div
          className={[
            "absolute -bottom-1 flex items-center gap-2 transition-opacity duration-200",
            controlsClassName,
          ].join(" ")}
        >
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => onSelect(slideIndex)}
              className={[
                "h-2.5 w-2.5 rounded-full transition-colors duration-300",
                slideIndex === safeIndex ? "bg-foreground" : "bg-muted-foreground/40",
              ].join(" ")}
              aria-label={`Слайд ${slideIndex + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
