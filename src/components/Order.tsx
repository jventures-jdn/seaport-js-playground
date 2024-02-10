import { Card } from "antd";
import { useOrder } from "../lib/orders";
import { useState } from "react";
import { OrderDeleteButton } from "./Order.Delete.Button";
import { OrderRaw } from "./Order.Raw";
import { OrderOffers } from "./Order.Offers";
import { OrderConsiderations } from "./Order.Considerations";

export function Order(props: { orderKey: string }) {
  const { orderKey } = props;
  const { order, raw } = useOrder(orderKey);
  const { title } = raw;
  const [activeTabKey, setActiveTabKey] = useState<string>("overview");
  if (!order) return null;
  return (
    <div>
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
            key: "manage",
            tab: "Manage",
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
        {activeTabKey === "manage" && <OrderDeleteButton orderKey={orderKey} />}
      </Card>
    </div>
  );
}
