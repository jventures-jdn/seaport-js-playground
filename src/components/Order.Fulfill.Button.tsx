import { Button, Flex, Tag } from "antd";
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
      <Flex gap="small" align="center">
        Fulfill<Tag color="blue">On Chain</Tag>
      </Flex>
    </Button>
  );
}
