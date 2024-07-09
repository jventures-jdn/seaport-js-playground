import {
  Button,
  Flex,
  Form,
  FormListFieldData,
  Input,
  InputNumber,
  Select,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { CreateOrderDraft, useDrafting } from "../lib/drafting";
import { Blockchain } from "../lib/blockchain";
import { ItemType } from "@opensea/seaport-js/lib/constants";

export function OrderDraftForm({
  draftId,
  disabled,
}: {
  draftId: string;
  disabled?: boolean;
}) {
  const [form] = Form.useForm<{
    chain_id: string;
    title: string;
    offers: CreateOrderDraft["tempOrder"]["offer"];
    considerations: CreateOrderDraft["tempOrder"]["consideration"];
  }>();
  const draft = useDrafting((state) => state.createOrders[draftId]);
  if (!draft) return null;
  return (
    <>
      <Form
        disabled={disabled}
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
          {
            name: "offers",
            value: draft.tempOrder.offer,
          },
          {
            name: "considerations",
            value: draft.tempOrder.consideration,
          },
        ]}
        onValuesChange={async (values, allValues) => {
          useDrafting.getState().updateCreateOrder(draftId, {
            ...draft,
            chainId: allValues.chain_id,
            title: allValues.title,
            tempOrder: {
              ...draft.tempOrder,
              offer: allValues.offers,
              consideration: allValues.considerations,
            },
            order: {
              ...draft.order,
              offer: allValues.offers.map((offer) =>
                useDrafting.getState().toCreateInputItem(offer)
              ),
              consideration: allValues.considerations.map((consideration) =>
                useDrafting.getState().toCreateInputItem(consideration)
              ),
            },
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
        <OrderItems draftId={draftId} of="offer" name="offers" label="Offers" />
        <OrderItems
          draftId={draftId}
          of="consideration"
          name="considerations"
          label="Considerations"
        />
      </Form>
    </>
  );
}

const OrderItems = ({
  of,
  draftId,
  name,
  label,
}: {
  of: "offer" | "consideration";
  draftId: string;
  name: string;
  label: string;
}) => {
  return (
    <Form.Item label={label}>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <div>
            {fields.map((field) => (
              <Flex key={field.key} align="start" gap="small">
                <Form.Item>
                  <div>{field.name + 1}</div>
                </Form.Item>
                <OrderItem
                  of={of}
                  draftId={draftId}
                  field={field}
                  remove={remove}
                />
              </Flex>
            ))}
            <Button onClick={() => add({ type: ItemType.NATIVE })}>Add</Button>
          </div>
        )}
      </Form.List>
    </Form.Item>
  );
};

const OrderItem = ({
  of,
  draftId,
  field,
  remove,
}: {
  of: "offer" | "consideration";
  draftId: string;
  field: FormListFieldData;
  remove: (index: number | number[]) => void;
}) => {
  const draft = useDrafting((state) => state.createOrders[draftId]);
  const item = draft.tempOrder[of][field.name] as any;
  if (!item) return null;
  return (
    <Flex wrap="wrap">
      <Form.Item name={[field.name, "type"]}>
        <Select>
          <Select.Option value={ItemType.NATIVE}>Native</Select.Option>
          <Select.Option value={ItemType.ERC20}>ERC20</Select.Option>
          <Select.Option value={ItemType.ERC721}>ERC721</Select.Option>
          <Select.Option value={ItemType.ERC1155}>ERC1155</Select.Option>
          <Select.Option value={ItemType.ERC721_WITH_CRITERIA}>
            ERC721_WC
          </Select.Option>
          <Select.Option value={ItemType.ERC1155_WITH_CRITERIA}>
            ERC1155_WC
          </Select.Option>
        </Select>
      </Form.Item>
      {item.type === ItemType.NATIVE && (
        <Form.Item
          name={[field.name, "native_amount"]}
          style={{ marginLeft: 8 }}
          required
        >
          <InputNumber
            addonBefore={
              Blockchain.chainIdToNativeCurrency(draft.chainId) || "ETH"
            }
            required
          />
        </Form.Item>
      )}
      {/* ERC20 */}
      {item.type === ItemType.ERC20 && (
        <>
          <Form.Item
            name={[field.name, "erc20_contract"]}
            style={{ marginLeft: 8 }}
            required
          >
            <Input addonBefore="Contract" required />
          </Form.Item>
          <Form.Item
            name={[field.name, "erc20_amount"]}
            style={{ marginLeft: 8 }}
            required
          >
            <Input addonBefore="Amount" required />
          </Form.Item>
          <Form.Item
            name={[field.name, "erc20_decimals"]}
            style={{ marginLeft: 8 }}
            required
          >
            <Input addonBefore="Decimals" defaultValue={18} />
          </Form.Item>
        </>
      )}
      {/* ERC721 */}
      {item.type === ItemType.ERC721 && (
        <>
          <Form.Item
            name={[field.name, "erc721_contract"]}
            style={{ marginLeft: 8 }}
            required
          >
            <Input addonBefore="Contract" required />
          </Form.Item>
          <Form.Item
            name={[field.name, "erc721_id"]}
            style={{ marginLeft: 8 }}
            required
          >
            <Input addonBefore="ID" required />
          </Form.Item>
        </>
      )}
      {/* ERC1155 */}
      {item.type === ItemType.ERC1155 && (
        <>
          <Form.Item
            name={[field.name, "erc1155_contract"]}
            style={{ marginLeft: 8 }}
            required
          >
            <Input addonBefore="Contract" required />
          </Form.Item>
          <Form.Item
            name={[field.name, "erc1155_id"]}
            style={{ marginLeft: 8 }}
            required
          >
            <Input addonBefore="ID" required />
          </Form.Item>
          <Form.Item
            name={[field.name, "erc1155_amount"]}
            style={{ marginLeft: 8 }}
            required
          >
            <InputNumber addonBefore="Amount" required />
          </Form.Item>
        </>
      )}
      <Form.Item style={{ marginLeft: 8 }}>
        <Button
          icon={<CloseOutlined />}
          onClick={() => {
            remove(field.name);
          }}
        />
      </Form.Item>
    </Flex>
  );
};
