import { useOrder } from "../lib/orders";
import { OrderItem } from "./Order.Item";

export function OrderConsiderations(props: { orderKey: string }) {
  const { orderKey } = props;
  const order = useOrder(orderKey);
  return (
    <div>
      {order.order.parameters.consideration.map((consideration, i) => (
        <OrderItem key={i} orderKey={orderKey} item={consideration} />
      ))}
    </div>
  );
}
