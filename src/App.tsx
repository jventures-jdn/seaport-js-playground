import { NavBar } from "./layout/NavBar";
import { Orders } from "./layout/Orders";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#282c34" }}>
      <NavBar />
      <div style={{ padding: 20 }}>
        <Orders />
      </div>
    </div>
  );
}
