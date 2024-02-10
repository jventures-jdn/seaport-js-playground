import { Button, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useOrder } from "../lib/orders";

export function OrderDeleteButton(props: { orderKey: string }) {
  const { orderKey } = props;
  const { loading, deleting, delete: del } = useOrder(orderKey);
  return (
    <Popconfirm
      title="Delete Confirmation"
      description="Are you sure to delete this order?"
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      onConfirm={del}
    >
      <Button danger loading={deleting} disabled={loading}>
        Delete
      </Button>
    </Popconfirm>
  );
}
