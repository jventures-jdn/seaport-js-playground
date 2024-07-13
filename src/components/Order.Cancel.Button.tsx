import { Button, Space, Tag, notification } from "antd";
import { useOrder } from "../lib/order";

export function OrderCancelButton(props: { orderKey: string; style?: any }) {
  const [api, contextHolder] = notification.useNotification();
  const { orderKey, style } = props;
  const { cancel } = useOrder(orderKey);
  return (
    <Button
      danger
      style={style}
      loading={cancel.isMutating}
      onClick={async () => {
        try {
          await cancel.trigger();
        } catch (e: any) {
          console.log(e);
          if (e.message?.startsWith("user rejected action")) return;
          api["error"]({
            message: "Fail to cancel order",
            description: e.message,
          });
        }
      }}
    >
      {contextHolder}
      <Space>
        Cancel
        <Tag color="blue">On-Chain</Tag>
      </Space>
    </Button>
  );
}
