import Card from "antd/es/card/Card";
import { useOrder } from "../lib/orders";
import { ConsiderationItem, OfferItem } from "@opensea/seaport-js/lib/types";
import { ethers } from "ethers";
import { Blockchain } from "../lib/blockchain";
import { Tag } from "antd";

export function OrderItemNative(props: {
  orderKey: string;
  item: OfferItem | ConsiderationItem;
}) {
  const { orderKey, item } = props;
  const { raw } = useOrder(orderKey);
  return (
    <Card size="small" style={{ fontSize: 18, width: 180 }}>
      {ethers.formatEther(item.startAmount)}
      <Tag color="gold" style={{ fontSize: 18, padding: 5, marginLeft: 5 }}>
        {Blockchain.chainIdToNativeCurrency(raw.chainId) || "ETH"}
      </Tag>
    </Card>
  );
}
