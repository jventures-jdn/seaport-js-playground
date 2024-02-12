import {
  Button,
  Flex,
  Modal,
  Popconfirm,
  Space,
  Tag,
  notification,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useDrafting } from "../lib/drafting";
import { OrderDraftForm } from "./OrderDraftForm";
import { useOrders } from "../lib/orders";

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
  const { create, creating } = useOrders();
  const [api, contextHolder] = notification.useNotification();
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
      maskClosable={!creating}
      closable={!creating}
      centered
      open={open}
      onCancel={() => !creating && setOpen(false)}
      width={1200}
      footer={
        <Flex align="center" justify="space-between">
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
            <Button disabled={creating} danger>
              {mode === "edit" ? "Delete" : "Discard"}
            </Button>
          </Popconfirm>
          <Space>
            <Button
              disabled={creating}
              onClick={() => {
                setOpen(false);
              }}
            >
              Save
            </Button>
            <Button
              loading={creating}
              type="primary"
              onClick={async () => {
                try {
                  const draft = useDrafting.getState().createOrders[draftId];
                  // const sp = await SeaportPlayground.init();
                  // for (let i = 0; i < draft.order.consideration.length; i++) {
                  //   (draft.order as any).consideration[i].recipient = sp.address;
                  // }
                  console.log(draft);
                  const result = await create(
                    draft.title,
                    ({ offerer }) => draft.order
                  );
                  if (result) {
                    useDrafting.getState().deleteCreateOrder(draftId);
                    setOpen(false);
                  }
                } catch (e: any) {
                  if (e.message?.startsWith("user rejected action")) return;
                  api["error"]({
                    message: "Fail to create order",
                    description: e.message,
                  });
                }
              }}
            >
              {contextHolder}
              Publish
            </Button>
          </Space>
        </Flex>
      }
    >
      {/* Form */}
      <OrderDraftForm draftId={draftId} disabled={creating} />
    </Modal>
  );
}
