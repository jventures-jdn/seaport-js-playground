import { Button, Space, Tag, notification } from "antd";
import { useOrder, useOrders } from "../lib/orders";

export function OrderFulfillButton(props: { orderKey: string }) {
  const [api, contextHolder] = notification.useNotification();
  const { orderKey } = props;
  const { order } = useOrder(orderKey);
  const { fulfill, fulfilling } = useOrders();
  return (
    <Button
      type="primary"
      loading={fulfilling}
      onClick={async () => {
        try {
          await fulfill(orderKey, order);
        } catch (e: any) {
          api["error"]({
            message: "Fail to fulfill order",
            description: e.message,
          });
        }
      }}
    >
      {contextHolder}
      <Space>
        Fulfill
        <Tag color="blue">On Chain</Tag>
      </Space>
    </Button>
  );
}
