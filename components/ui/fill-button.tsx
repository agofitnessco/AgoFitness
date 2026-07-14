import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import clsx from "clsx";
import { ReactNode } from "react";

type FillButtonProps = {
  children: ReactNode;
  size?: "md" | "sm";
  showArrow?: boolean;
} & (
  | { href: string; type?: never; onClick?: never }
  | { href?: undefined; type: "submit" | "button"; onClick?: () => void }
);

const SIZE_CLASSES = {
  md: "gap-4 px-9 py-3 text-lg",
  sm: "gap-3 px-5 py-2 text-base",
};

const CIRCLE_SIZE_CLASSES = {
  md: "h-9 w-9",
  sm: "h-7 w-7",
};

const ARROW_ICON_SIZE_CLASSES = {
  md: "h-4 w-4",
  sm: "h-3.5 w-3.5",
};

export default function FillButton({
  children,
  size = "md",
  showArrow = true,
  ...rest
}: FillButtonProps) {
  const inner = (
    <>
      <span className="relative z-30 font-bold text-black transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
      {showArrow ? (
        <span
          className={clsx(
            "relative z-20 flex flex-none items-center justify-center",
            CIRCLE_SIZE_CLASSES[size],
          )}
        >
          <span
            className={clsx(
              "absolute inset-0 z-0 rounded-full bg-[#b48b8c] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[20]",
            )}
          />
          <ArrowRightIcon
            className={clsx(
              "relative z-10 text-white transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0.5",
              ARROW_ICON_SIZE_CLASSES[size],
            )}
          />
        </span>
      ) : null}
    </>
  );

  const baseClass = clsx(
    "group relative inline-flex flex-none items-center overflow-hidden rounded-lg transition-transform duration-150 active:scale-95",
    SIZE_CLASSES[size],
  );

  if ("href" in rest && rest.href) {
    return (
      <Link href={rest.href} prefetch={true} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={rest.type} onClick={rest.onClick} className={baseClass}>
      {inner}
    </button>
  );
}
