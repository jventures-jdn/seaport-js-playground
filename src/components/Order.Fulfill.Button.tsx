import { Button } from "antd";
import { useOrder, useOrders } from "../lib/orders";

export function OrderFulfillButton(props: { orderKey: string }) {
  const { orderKey } = props;
  const { order } = useOrder(orderKey);
  const { fulfill, fulfilling } = useOrders();
  return (
    <Button
      loading={fulfilling}
      onClick={async () => {
        await fulfill(order);
      }}
    >
      Fulfill
    </Button>
  );
}
