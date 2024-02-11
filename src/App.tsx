import { ethers } from "ethers";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { Button } from "antd";
import { Orders } from "./components/Orders";
import { useOrders } from "./lib/orders";

function App() {
  const { create, creating } = useOrders();

  return (
    <div>
      <div style={{ padding: 20 }}>
        <Orders />
      </div>
      <Button
        loading={creating}
        onClick={async () => {
          await create(({ offerer }) => ({
            offer: [
              {
                itemType: ItemType.ERC721,
                token: "0x09a473439deB547fAc88d5655fb69e000D2efe5A",
                identifier:
                  "2218958502915401787612776207602548135263838775715842798634660580556841",
              },
            ],
            consideration: [
              {
                amount: ethers.parseEther("0.5").toString(),
                recipient: offerer,
              },
            ],
          }));
        }}
      >
        Create
      </Button>
      {/* <Button
        onClick={async () => {
          if (!order) return;
          const sp = await SeaportPlayground.init();
          console.log("fulfiller", sp.address);

          const fulfillResult = await sp.seaport.fulfillOrder({
            order,
            accountAddress: sp.address,
          });

          console.log("actions", fulfillResult.actions);
          const transaction = await fulfillResult.executeAllActions();
          console.log("transaction", transaction);
        }}
      >
        Fulfill
      </Button> */}
    </div>
  );
}

export default App;
