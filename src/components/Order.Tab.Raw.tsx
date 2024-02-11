import { useOrder } from "../lib/order";

export function OrderRaw(props: { orderKey: string }) {
  const { orderKey } = props;
  const { raw } = useOrder(orderKey);
  if (!raw) return null;
  return (
    <pre
      style={{
        maxWidth: 650,
        overflowY: "scroll",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        maxHeight: 300,
      }}
    >
      {JSON.stringify(raw, null, 2)}
    </pre>
  );
}
