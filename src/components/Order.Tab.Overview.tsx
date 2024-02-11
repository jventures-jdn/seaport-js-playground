import { Flex, Input, Tag } from "antd";
import { useOrder } from "../lib/order";

export function OrderOverview(props: { orderKey: string }) {
  const { orderKey } = props;
  const { raw, order, status } = useOrder(orderKey);
  const orderStatus = status();
  return (
    <Flex vertical gap="small">
      <Tag color="darkgray">Off-Chain Data</Tag>
      <Flex gap="small">
        <Input
          size="small"
          style={{ maxWidth: 190 }}
          addonBefore="Chain ID"
          value={raw.chainId}
          readOnly
        />
        <Input
          size="small"
          addonBefore="Offerer"
          value={order.parameters.offerer}
          readOnly
        />
      </Flex>
      <Input size="small" addonBefore="Order Hash" value={orderKey} readOnly />
      <Input
        size="small"
        addonBefore="Signature"
        value={order.signature}
        readOnly
      />
      <br style={{ margin: 100 }} />
      <Tag color="blue">On-Chain Status</Tag>
      <Flex gap="small" wrap="wrap">
        <Input
          size="small"
          style={{ maxWidth: 150 }}
          addonBefore="Is Validated"
          value={orderStatus.data?.isValidated.toString() || ""}
          readOnly
        />
        <Input
          size="small"
          style={{ maxWidth: 160 }}
          addonBefore="Is Cancelled"
          value={orderStatus.data?.isCancelled.toString() || ""}
          readOnly
        />
        <Input
          size="small"
          style={{ maxWidth: 150 }}
          addonBefore="Total Filled"
          value={orderStatus.data?.totalFilled.toString() || ""}
          readOnly
        />
        <Input
          size="small"
          style={{ maxWidth: 150 }}
          addonBefore="Total Size"
          value={orderStatus.data?.totalSize.toString() || ""}
          readOnly
        />
      </Flex>
    </Flex>
  );
}
