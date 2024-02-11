import { Flex, Space } from "antd";
import { OrderCreateButton } from "../components/Order.Create.Button";
import { Account } from "./Account";
import { useDrafting } from "../lib/drafting";
import { OrderDraftsButton } from "../components/Order.Drafts.Button";

export function NavBar() {
  const draftsCount = useDrafting((state) => state.hasDrafts());
  return (
    <Flex
      gap="small"
      align="center"
      wrap="wrap"
      justify="space-between"
      style={{
        padding: 20,
        position: "sticky",
        top: 0,
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        zIndex: 1,
      }}
    >
      <Flex vertical>
        <Flex
          gap="small"
          align="center"
          style={{ fontSize: 18, marginBottom: 4 }}
        >
          <b>⛵ Seaport Playground</b>
          <span style={{ fontSize: 15 }}>by JFIN Chain</span>
        </Flex>
        <Account />
      </Flex>
      <Space>
        {draftsCount > 0 && <OrderDraftsButton />}
        <OrderCreateButton />
      </Space>
    </Flex>
  );
}
