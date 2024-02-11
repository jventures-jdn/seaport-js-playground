import { Button, Flex, Modal, Popconfirm, Space, Tag } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useDrafting } from "../lib/drafting";
import { OrderDraft } from "./OrderDraft";

export function OrderDraftModal({
  mode,
  draftId,
  open,
  setOpen,
  onCanceling,
}: {
  mode: "create" | "edit";
  draftId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onCanceling?: (draftId: string) => void;
}) {
  return (
    <Modal
      title={
        <Flex vertical>
          <Flex gap="small" align="center">
            <span>Order Draft</span>
            {mode === "create" && <Tag color="blue">Creating</Tag>}
            {mode === "edit" && <Tag color="yellow">Editing</Tag>}
          </Flex>
          <span style={{ fontSize: 12, fontWeight: "normal" }}>
            Draft ID : {draftId}
          </span>
        </Flex>
      }
      centered
      open={open}
      closable={false}
      maskClosable={false}
      width={1000}
      footer={
        <Flex align="center" justify="space-between">
          <Space>
            <Popconfirm
              title="Delete Confirmation"
              description="Are you sure to delete this order?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => {
                onCanceling?.(draftId);
                useDrafting.getState().deleteCreateOrder(draftId);
                setOpen(false);
              }}
            >
              <Button danger>{mode === "edit" ? "Delete" : "Discard"}</Button>
            </Popconfirm>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              Save
            </Button>
          </Space>
          <Button
            disabled
            type="primary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Create
          </Button>
        </Flex>
      }
    >
      {/* Form */}
      <OrderDraft draftId={draftId} />
    </Modal>
  );
}
