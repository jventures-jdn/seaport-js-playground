import { Flex } from "antd";
import { useOrder } from "../lib/order";
import { OrderItem } from "./Order.Item";

export function OrderConsiderations(props: { orderKey: string }) {
  const { orderKey } = props;
  const order = useOrder(orderKey);
  return (
    <Flex gap="middle" align="center" wrap="wrap">
      {order.order.parameters.consideration.map((consideration, i) => (
        <OrderItem key={i} orderKey={orderKey} item={consideration} />
      ))}
    </Flex>
  );
}
