"use client";

import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  NEUTRAL_HEX,
  modelGradient,
  productGradient,
} from "lib/color-placeholder";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type ColorSwatch = { name: string; hex: string };

function CombinarLink() {
  return (
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("ideas-para-combinar")
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-black uppercase transition-opacity hover:opacity-60"
    >
      Ideas para combinar
      <ArrowDownIcon className="h-3.5 w-3.5" />
    </button>
  );
}

export function Gallery({
  images,
  colorSwatches,
}: {
  images: { src: string; altText: string }[];
  colorSwatches?: ColorSwatch[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (images.length === 0) {
    const activeColorName = searchParams.get("color");
    const activeColor =
      colorSwatches?.find((c) => c.name === activeColorName) ??
      colorSwatches?.[0];
    const hex = activeColor?.hex ?? NEUTRAL_HEX;

    return (
      <>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: productGradient(hex) }}
          />
          <Image
            src="/imgs/logo-ago.png"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain p-16 opacity-20 mix-blend-overlay md:p-24"
          />
          <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase backdrop-blur-sm">
            Foto próximamente
          </div>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: modelGradient(hex) }}
          />
          <Image
            src="/imgs/logo-ago.png"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain p-16 opacity-20 mix-blend-overlay md:p-24"
          />
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <CombinarLink />
      </div>
    </>
    );
  }

  const imageIndex = searchParams.has("image")
    ? parseInt(searchParams.get("image")!)
    : 0;
  const secondImageIndex = (imageIndex + 1) % images.length;

  const updateImage = (index: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", index);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const nextImageIndex = (imageIndex + 1) % images.length;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-100";

  return (
    <form>
      <div
        className={clsx(
          "grid gap-3 md:gap-4",
          images.length > 1 ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
          {images[imageIndex] && (
            <Image
              className="h-full w-full object-cover"
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              alt={images[imageIndex]?.altText as string}
              src={images[imageIndex]?.src as string}
              priority={true}
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
            <Image
              className="h-full w-full object-cover"
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              alt={images[secondImageIndex]?.altText as string}
              src={images[secondImageIndex]?.src as string}
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        {images.length > 1 ? (
          <div className="flex items-center gap-3 text-neutral-500">
            <button
              formAction={() => updateImage(previousImageIndex.toString())}
              aria-label="Imagen anterior"
              className={buttonClassName}
            >
              <ArrowLeftIcon className="h-4" />
            </button>
            <button
              formAction={() => updateImage(nextImageIndex.toString())}
              aria-label="Siguiente imagen"
              className={buttonClassName}
            >
              <ArrowRightIcon className="h-4" />
            </button>
            <span className="text-sm tabular-nums">
              {imageIndex + 1}/{images.length}
            </span>
          </div>
        ) : (
          <span />
        )}
        <CombinarLink />
      </div>

      {images.length > 2 ? (
        <ul className="mt-4 flex items-center flex-wrap gap-2 overflow-auto py-1">
          {images.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <li key={image.src} className="h-16 w-16">
                <button
                  formAction={() => updateImage(index.toString())}
                  aria-label="Seleccionar imagen"
                  className={clsx(
                    "relative h-full w-full overflow-hidden rounded-lg border-2 bg-neutral-100 transition-colors",
                    isActive
                      ? "border-black"
                      : "border-transparent hover:border-neutral-300",
                  )}
                >
                  <Image
                    className="object-cover"
                    fill
                    alt={image.altText}
                    src={image.src}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
