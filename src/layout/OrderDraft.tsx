import { Form, Input } from "antd";
import { useDrafting } from "../lib/drafting";

export function OrderDraft({ draftId }: { draftId: string }) {
  const [form] = Form.useForm();
  const draft = useDrafting((state) => state.createOrders[draftId]);
  if (!draft) return null;
  return (
    <>
      <Form
        form={form}
        fields={[
          {
            name: "chain_id",
            value: draft.chainId,
          },
          {
            name: "title",
            value: draft.title,
          },
        ]}
        onValuesChange={(values, allValues) => {
          useDrafting.getState().updateCreateOrder(draftId, {
            ...draft,
            chainId: allValues.chain_id,
            title: allValues.title,
          });
        }}
        style={{ marginTop: 20 }}
      >
        <Form.Item name="chain_id" label="Chain ID">
          <Input disabled />
        </Form.Item>
        <Form.Item name="title" label="Title">
          <Input />
        </Form.Item>
      </Form>
    </>
  );
}
