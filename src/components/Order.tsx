import { Badge, Card, Flex, Tag } from "antd";
import { useOrder } from "../lib/order";
import { useState } from "react";
import { OrderRaw } from "./Order.Tab.Raw";
import { OrderOffers } from "./Order.Tab.Offers";
import { OrderConsiderations } from "./Order.Tab.Considerations";
import { Blockchain } from "../lib/blockchain";
import { OrderAction } from "./Order.Tab.Action";
import { OrderOverview } from "./Order.Tab.Overview";
import { OrderStatus } from "./Order.Tab.Status";

const tabs = [
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
    tab: (
      <Flex gap="small" align="center">
        Order<Tag>Off-Chain</Tag>
      </Flex>
    ),
  },
  {
    key: "status",
    tab: (
      <Flex gap="small" align="center">
        Status<Tag color="blue">On-Chain</Tag>
      </Flex>
    ),
  },
  {
    key: "action",
    tab: "Action",
  },
];

export function Order(props: { orderKey: string }) {
  const { orderKey } = props;
  const { order, raw, status } = useOrder(orderKey);
  const orderStatus = status();
  const { title } = raw;
  const [activeTabKey, setActiveTabKey] = useState<string>("overview");
  if (!order) return null;

  return (
    <div style={{ minWidth: 300 }}>
      <Badge.Ribbon
        text={Blockchain.chainIdToBlockchainName(raw.chainId) || raw.chainId}
      >
        <Card
          title={
            <Flex vertical gap="small">
              <div>
                <Flex gap="small" align="center">
                  📣 {title}
                  {orderStatus.data?.isValidated &&
                    !orderStatus.data?.totalFilled && (
                      <Tag color="green">Validated</Tag>
                    )}
                  {orderStatus.data?.isCancelled && (
                    <Tag color="red">Cancelled</Tag>
                  )}
                  {orderStatus.data?.totalFilled !== undefined &&
                    orderStatus.data?.totalFilled.toString() !== "0" && (
                      <Tag color="green">
                        Filled {orderStatus.data?.totalFilled.toString()}/
                        {orderStatus.data?.totalSize.toString()}
                      </Tag>
                    )}
                </Flex>
              </div>
              <span style={{ fontSize: 12, fontWeight: "normal" }}>
                <div>Offerer : {order.parameters.offerer}</div>
                <div>Order Hash : {orderKey}</div>
              </span>
            </Flex>
          }
          tabProps={{ size: "small" }}
          tabList={tabs}
          activeTabKey={activeTabKey}
          onTabChange={setActiveTabKey}
        >
          {activeTabKey === "overview" && <OrderOverview orderKey={orderKey} />}
          {activeTabKey === "offers" && <OrderOffers orderKey={orderKey} />}
          {activeTabKey === "considerations" && (
            <OrderConsiderations orderKey={orderKey} />
          )}
          {activeTabKey === "raw" && <OrderRaw orderKey={orderKey} />}
          {activeTabKey === "status" && <OrderStatus orderKey={orderKey} />}
          {activeTabKey === "action" && <OrderAction orderKey={orderKey} />}
        </Card>
      </Badge.Ribbon>
    </div>
  );
}
