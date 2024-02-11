import { Flex } from "antd";
import { Orders } from "./components/Orders";
import { Account } from "./components/Account";
import { OrderCreateButton } from "./components/Order.Create.Button";
import "./App.css";

function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#282c34" }}>
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
        <Account />
        <OrderCreateButton />
      </Flex>

      <div style={{ padding: 20 }}>
        <Orders />
      </div>
    </div>
  );
}

export default App;
