import { Divider, Flex, Input } from "antd";
import { OrderDeleteButton } from "./Order.Delete.Button";
import { OrderFulfillButton } from "./Order.Fulfill.Button";
import { OrderValidateButton } from "./Order.Validate.Button";
import { OrderCancelButton } from "./Order.Cancel.Button";
import { useState } from "react";

export function OrderAction(props: { orderKey: string }) {
  const { orderKey } = props;
  const [recipient, setRecipient] = useState<string>("");
  return (
    <Flex vertical gap="middle">
      <Flex gap="middle" flex={1}>
        <Input
          placeholder="Recipient (Optional)"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <OrderFulfillButton
          orderKey={orderKey}
          recipient={recipient || undefined}
        />
      </Flex>
      <Flex gap="middle" flex={1}>
        <Flex flex={1}>
          <OrderCancelButton orderKey={orderKey} style={{ width: "100%" }} />
        </Flex>
        <Flex flex={1}>
          <OrderValidateButton orderKey={orderKey} style={{ width: "100%" }} />
        </Flex>
      </Flex>
      <Divider plain style={{ margin: "10px 0" }} />
      <OrderDeleteButton orderKey={orderKey} />
    </Flex>
  );
}
