import { Button, Space, Tag, notification } from "antd";
import { useOrder } from "../lib/order";

export function OrderCancelButton(props: { orderKey: string }) {
  const [api, contextHolder] = notification.useNotification();
  const { orderKey } = props;
  const { cancel } = useOrder(orderKey);
  return (
    <Button
      danger
      type="primary"
      loading={cancel.isMutating}
      onClick={async () => {
        try {
          await cancel.trigger();
        } catch (e: any) {
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
        <Tag color="blue">On Chain</Tag>
      </Space>
    </Button>
  );
}