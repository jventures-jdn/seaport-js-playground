import { Divider, Flex } from "antd";
import { OrderDeleteButton } from "./Order.Delete.Button";
import { OrderFulfillButton } from "./Order.Fulfill.Button";
import { OrderValidateButton } from "./Order.Validate.Button";
import { OrderCancelButton } from "./Order.Cancel.Button";

export function OrderAction(props: { orderKey: string }) {
  const { orderKey } = props;
  return (
    <Flex vertical gap="middle">
      <OrderFulfillButton orderKey={orderKey} />
      <OrderValidateButton orderKey={orderKey} />
      <OrderCancelButton orderKey={orderKey} />
      <Divider plain style={{ margin: "10px 0" }} />
      <OrderDeleteButton orderKey={orderKey} />
    </Flex>
  );
}
