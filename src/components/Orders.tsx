import { Card, Flex } from "antd";
import { useOrders } from "../lib/orders";
import { Order } from "./Order";

export function Orders() {
  const { isLoading, orders } = useOrders();
  if (isLoading)
    return (
      <>
        <Card loading></Card>
        <Card loading></Card>
        <Card loading></Card>
      </>
    );
  return (
    <Flex gap="middle" vertical>
      {orders?.map(({ key }) => (
        <Order key={key} orderKey={key} />
      ))}
    </Flex>
  );
}
