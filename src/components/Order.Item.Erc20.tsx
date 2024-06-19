import Card from "antd/es/card/Card";
import { ConsiderationItem, OfferItem } from "@opensea/seaport-js/lib/types";
import { ethers } from "ethers";
import { Tag } from "antd";

export function OrderItemErc20(props: {
  orderKey: string;
  item: OfferItem | ConsiderationItem;
}) {
  const { item } = props;
  return (
    <Card size="small" style={{ fontSize: 18, width: 180 }}>
      {ethers.formatEther(item.startAmount)}
      <Tag color="gold" style={{ fontSize: 18, padding: 5, marginLeft: 5 }}>
        {item.token}
      </Tag>
    </Card>
  );
}
