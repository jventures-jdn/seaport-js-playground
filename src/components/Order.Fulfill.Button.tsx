import { Button, Space, Tag, notification } from "antd";
import { useOrder } from "../lib/order";

export function OrderFulfillButton(props: {
  orderKey: string;
  recipient?: string;
  fulfiller?: string;
}) {
  const [api, contextHolder] = notification.useNotification();
  const { orderKey, recipient, fulfiller } = props;
  const { fulfill } = useOrder(orderKey);
  return (
    <Button
      type="primary"
      loading={fulfill.isMutating}
      onClick={async () => {
        try {
          await fulfill.trigger({ recipient, fulfiller });
        } catch (e: any) {
          if (e.message?.startsWith("user rejected action")) return;
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
