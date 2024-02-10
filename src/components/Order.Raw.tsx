import { useOrder } from "../lib/orders";

export function OrderRaw(props: { orderKey: string }) {
  const { orderKey } = props;
  const { raw } = useOrder(orderKey);
  if (!raw) return null;
  return <pre>{JSON.stringify(raw, null, 2)}</pre>;
}
