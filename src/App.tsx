import { Flex } from "antd";
import { Orders } from "./components/Orders";
import { Account } from "./components/Account";
import { OrderCreateButton } from "./components/Order.Create.Button";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <Flex gap="small" align="center">
        <Account />
        <OrderCreateButton />
      </Flex>
      <br />
      <Orders />
    </div>
  );
}

export default App;
