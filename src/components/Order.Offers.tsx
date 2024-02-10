import { useOrder } from "../lib/orders";
import { OrderItem } from "./Order.Item";

export function OrderOffers(props: { orderKey: string }) {
  const { orderKey } = props;
  const order = useOrder(orderKey);
  return (
    <div>
      {order.order.parameters.offer.map((offer, i) => (
        <OrderItem key={i} orderKey={orderKey} item={offer} />
      ))}
    </div>
  );
}
