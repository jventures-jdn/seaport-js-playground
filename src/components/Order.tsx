import { Badge, Card } from "antd";
import { useOrder } from "../lib/orders";
import { useState } from "react";
import { OrderRaw } from "./Order.Raw";
import { OrderOffers } from "./Order.Offers";
import { OrderConsiderations } from "./Order.Considerations";
import { Blockchain } from "../lib/blockchain";
import { OrderAction } from "./Order.Action";

export function Order(props: { orderKey: string }) {
  const { orderKey } = props;
  const { order, raw } = useOrder(orderKey);
  const { title } = raw;
  const [activeTabKey, setActiveTabKey] = useState<string>("overview");
  if (!order) return null;
  return (
    <Badge.Ribbon
      style={{ textTransform: "capitalize" }}
      text={
        Blockchain.chainIdToNetworkName(raw.chainId)?.split("_").join(" ") ||
        raw.chainId
      }
    >
      <Card
        style={{ width: "100%" }}
        title={
          <>
            <div>{title}</div>
            <span style={{ fontSize: 12, fontWeight: "normal" }}>
              {orderKey}
            </span>
          </>
        }
        tabList={[
          {
            key: "overview",
            tab: "Overview",
          },
          {
            key: "offers",
            tab: "Offers",
          },
          {
            key: "considerations",
            tab: "Considerations",
          },
          {
            key: "raw",
            tab: "Raw",
          },
          {
            key: "action",
            tab: "Action",
          },
        ]}
        activeTabKey={activeTabKey}
        onTabChange={setActiveTabKey}
      >
        {activeTabKey === "offers" && <OrderOffers orderKey={orderKey} />}
        {activeTabKey === "considerations" && (
          <OrderConsiderations orderKey={orderKey} />
        )}
        {activeTabKey === "raw" && <OrderRaw orderKey={orderKey} />}
        {activeTabKey === "action" && <OrderAction orderKey={orderKey} />}
      </Card>
    </Badge.Ribbon>
  );
}
