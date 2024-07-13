import { Button, Space, Tag, notification } from "antd";
import { useOrder } from "../lib/order";

export function OrderValidateButton(props: { orderKey: string; style?: any }) {
  const [api, contextHolder] = notification.useNotification();
  const { orderKey, style } = props;
  const { validate } = useOrder(orderKey);
  return (
    <Button
      style={style}
      loading={validate.isMutating}
      onClick={async () => {
        try {
          await validate.trigger();
        } catch (e: any) {
          console.log(e);
          if (e.message?.startsWith("user rejected action")) return;
          api["error"]({
            message: "Fail to validate order",
            description: e.message,
          });
        }
      }}
    >
      {contextHolder}
      <Space>
        Validate
        <Tag color="blue">On-Chain</Tag>
      </Space>
    </Button>
  );
}
