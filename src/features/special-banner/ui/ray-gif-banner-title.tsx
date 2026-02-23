import { cn } from "@/shared/lib/utils";

type RayGifBannerTitleProps = {
  title: string;
  textClassName: string;
  borderClassName?: string;
  size: "compact" | "fullscreen";
  element?: "div" | "h2";
};

export function RayGifBannerTitle({
  title,
  textClassName,
  borderClassName = "",
  size,
  element = "h2",
}: RayGifBannerTitleProps) {
  const sizeClassName = size === "fullscreen"
    ? "text-4xl sm:text-5xl px-6 py-3 rounded-xl"
    : "text-sm sm:text-base px-3 py-1 rounded-xl";
  const Component = element;

  return (
    <Component
      className={cn(
        "font-black tracking-wide text-center drop-shadow-lg bg-white",
        textClassName,
        borderClassName,
        sizeClassName,
      )}
    >
      {title}
    </Component>
  );
}
