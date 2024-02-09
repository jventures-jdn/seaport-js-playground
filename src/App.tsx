import React, { useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { SeaportPlayground } from "./lib/seaport";
import { Button } from "antd";
import { useApi } from "./lib/api";

function App() {
  const [order, setOrder] = useState<any>();
  const kvApi = useApi().kv();

  return (
    <div className="App">
      <header className="App-header">
        <Button
          onClick={async () => {
            await kvApi.write.trigger({ key: "test", value: "test" });
          }}
        >
          Test write KV
        </Button>
        <Button
          onClick={async () => {
            const sp = await SeaportPlayground.init();
            console.log("offerer", sp.address);

            const { order, orderHash } = await sp.createOffChainOrder({
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
                  amount: ethers.parseEther("2").toString(),
                  recipient: sp.address,
                },
              ],
            });

            console.log("order", order);
            // const hash = sp.seaport.getOrderHash(order.parameters);
            console.log("orderHash", orderHash);
            //await seaport.validate([order]).transact();
            // await sp.seaport.cancelOrders([order.parameters]).transact();
            setOrder(order);
          }}
        >
          Offer
        </Button>
        <Button
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
        </Button>
      </header>
    </div>
  );
}

export default App;
