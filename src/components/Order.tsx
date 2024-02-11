import { Badge, Card } from "antd";
import { useOrder } from "../lib/orders";
import { useState } from "react";
import { OrderRaw } from "./Order.Tab.Raw";
import { OrderOffers } from "./Order.Tab.Offers";
import { OrderConsiderations } from "./Order.Tab.Considerations";
import { Blockchain } from "../lib/blockchain";
import { OrderAction } from "./Order.Tab.Action";
import { OrderOverview } from "./Order.Tab.Overview";

export function Order(props: { orderKey: string }) {
  const { orderKey } = props;
  const { order, raw } = useOrder(orderKey);
  const { title } = raw;
  const [activeTabKey, setActiveTabKey] = useState<string>("overview");
  if (!order) return null;
  return (
    <Badge.Ribbon
      text={Blockchain.chainIdToBlockchainName(raw.chainId) || raw.chainId}
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
        {activeTabKey === "overview" && <OrderOverview orderKey={orderKey} />}
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
