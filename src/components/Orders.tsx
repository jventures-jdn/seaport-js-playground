import { Flex } from "antd";
import { useOrders } from "../lib/orders";
import { Order } from "./Order";

export function Orders() {
  const { isLoading, orders } = useOrders();
  if (isLoading) return <div>Loading...</div>;
  return (
    <Flex gap="middle" vertical>
      {orders?.map(({ key }) => (
        <Order key={key} orderKey={key} />
      ))}
    </Flex>
  );
}
