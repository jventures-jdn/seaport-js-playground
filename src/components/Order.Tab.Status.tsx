import { Button } from "antd";
import { useOrder } from "../lib/order";

export function OrderStatus(props: { orderKey: string }) {
  const { orderKey } = props;
  const status = useOrder(orderKey).status();
  if (status.isLoading) return <div>Loading...</div>;
  if (!status.data) return null;
  return (
    <>
      <pre style={{ overflowY: "scroll", maxHeight: 300 }}>
        {JSON.stringify(
          status.data,
          (key, value) =>
            typeof value === "bigint" ? value.toString() : value, // return everything else unchanged
          2
        )}
      </pre>
      <Button
        loading={status.isValidating}
        onClick={() => {
          status.mutate();
        }}
      >
        Update
      </Button>
    </>
  );
}
