import Image from "next/image";
import Price from "components/price";
import type { Order } from "lib/shopify/types";

const STATUS_LABELS: Record<string, string> = {
  PAID: "Pagado",
  PENDING: "Pendiente",
  REFUNDED: "Reembolsado",
  PARTIALLY_REFUNDED: "Parcialmente reembolsado",
  VOIDED: "Anulado",
  FULFILLED: "Enviado",
  UNFULFILLED: "Por enviar",
  PARTIALLY_FULFILLED: "Parcialmente enviado",
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export default function OrdersPanel({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="text-neutral-500">Todavía no tienes pedidos.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {orders.map((order) => (
        <li key={order.id} className="rounded-lg border border-neutral-200 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-bold text-black">
                Pedido #{order.orderNumber}
              </p>
              <p className="text-sm text-neutral-500">
                {new Date(order.processedAt).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-neutral-600 uppercase">
                {statusLabel(order.fulfillmentStatus)}
              </span>
              <Price
                amount={order.currentTotalPrice.amount}
                currencyCode={order.currentTotalPrice.currencyCode}
                className="font-bold text-black"
              />
            </div>
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {order.lineItems.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="relative h-12 w-12 flex-none overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                  {item.image ? (
                    <Image
                      src={item.image.url}
                      alt={item.image.altText || item.title}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-black">
                    {item.title}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {item.variantTitle && item.variantTitle !== "Default Title"
                      ? `${item.variantTitle} · `
                      : ""}
                    Cantidad: {item.quantity}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href={order.statusUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm font-bold text-black underline underline-offset-2"
          >
            Ver estado del pedido
          </a>
        </li>
      ))}
    </ul>
  );
}
