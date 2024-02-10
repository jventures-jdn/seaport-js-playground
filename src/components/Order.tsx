import { Button, Card } from "antd";
import { useOrder } from "../lib/orders";
import { useState } from "react";
import { useApi } from "../lib/api";

function Raw(props: { orderKey: string }) {
  const { orderKey } = props;
  const { order } = useOrder(orderKey);
  if (!order) return null;
  return <pre>{JSON.stringify(order, null, 2)}</pre>;
}

export function Order(props: { orderKey: string }) {
  const { orderKey } = props;
  const { order, delete: del, loading } = useOrder(orderKey);
  const token = useApi()
    .hnftPublic()
    .tokenData(
      "jfin_testnet",
      "0x09a473439deB547fAc88d5655fb69e000D2efe5A",
      "2218958502915401787612776207602548135263838775715842798634660580556841"
    );
  console.log(token.data);
  const [activeTabKey, setActiveTabKey] = useState<string>("overview");
  if (!order) return null;
  return (
    <div>
      <Card
        style={{ width: "100%" }}
        title={orderKey}
        extra={
          <Button loading={loading} onClick={del}>
            Delete
          </Button>
        }
        tabList={[
          {
            key: "overview",
            tab: "Overview",
          },
          {
            key: "raw",
            tab: "Raw",
          },
        ]}
        activeTabKey={activeTabKey}
        onTabChange={setActiveTabKey}
      >
        {activeTabKey === "raw" && <Raw orderKey={orderKey} />}
      </Card>
    </div>
  );
}
