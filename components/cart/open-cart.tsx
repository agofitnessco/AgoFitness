import BagIcon from "components/icons/bag";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
  transparent,
}: {
  className?: string;
  quantity?: number;
  transparent?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative flex h-11 w-11 items-center justify-center transition-colors",
        transparent ? "text-white" : "text-black",
      )}
    >
      <BagIcon
        className={clsx(
          "h-5 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />

      {quantity ? (
        <div
          className={clsx(
            "absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium",
            transparent ? "bg-white text-black" : "bg-black text-white",
          )}
        >
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
