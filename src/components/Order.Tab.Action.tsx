import { Flex } from "antd";
import { OrderDeleteButton } from "./Order.Delete.Button";
import { OrderFulfillButton } from "./Order.Fulfill.Button";

export function OrderAction(props: { orderKey: string }) {
  const { orderKey } = props;
  return (
    <Flex vertical gap="middle">
      <OrderFulfillButton orderKey={orderKey} />
      <OrderDeleteButton orderKey={orderKey} />
    </Flex>
  );
}
