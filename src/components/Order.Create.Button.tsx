import { Button } from "antd";
import { useOrders } from "../lib/orders";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { ethers } from "ethers";

export function OrderCreateButton() {
  const { create, creating } = useOrders();
  return (
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
      Create Order
    </Button>
  );
}
