import { Button, Popconfirm, Space, Tag } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useOrder } from "../lib/order";

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
      <Button danger type="primary" loading={deleting} disabled={loading}>
        <Space>
          Delete
          <Tag>Off-Chain</Tag>
        </Space>
      </Button>
    </Popconfirm>
  );
}
