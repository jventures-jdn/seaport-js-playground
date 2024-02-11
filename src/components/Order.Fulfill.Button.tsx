import { Button } from "antd";
import { useOrder } from "../lib/orders";

export function OrderFulfillButton(props: { orderKey: string }) {
  const { orderKey } = props;
  const {} = useOrder(orderKey);
  return <Button>Fulfill</Button>;
}
