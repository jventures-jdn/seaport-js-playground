import { Card, Flex } from "antd";
import { useOrders } from "../lib/orders";
import { Order } from "./Order";

export function Orders() {
  const { isLoading, orders, creating } = useOrders();
  const Skeleton = () => (
    <Card loading style={{ minWidth: 300, width: 700, height: 380 }} />
  );
  return (
    <Flex gap="large" wrap="wrap" justify="center" align="center">
      {creating && <Skeleton />}
      {isLoading && (
        <>
          <Skeleton />
          <Skeleton />
        </>
      )}
      {!isLoading &&
        orders?.map(({ key }) => <Order key={key} orderKey={key} />)}
    </Flex>
  );
}
