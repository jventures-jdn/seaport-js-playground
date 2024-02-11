import { Flex } from "antd";
import { useOrder } from "../lib/orders";
import { OrderItem } from "./Order.Item";

export function OrderOffers(props: { orderKey: string }) {
  const { orderKey } = props;
  const order = useOrder(orderKey);
  return (
    <Flex gap="middle" align="center" wrap="wrap">
      {order.order.parameters.offer.map((offer, i) => (
        <OrderItem key={i} orderKey={orderKey} item={offer} />
      ))}
    </Flex>
  );
}
