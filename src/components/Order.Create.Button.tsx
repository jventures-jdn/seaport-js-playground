import { Button, notification } from "antd";
import { useOrders } from "../lib/orders";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { ethers } from "ethers";

export function OrderCreateButton() {
  const [api, contextHolder] = notification.useNotification();
  const { create, creating } = useOrders();
  return (
    <Button
      type="primary"
      loading={creating}
      onClick={async () => {
        try {
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
        } catch (e: any) {
          api["error"]({
            message: "Fail to create order",
            description: e.message,
          });
        }
      }}
      icon={"📣"}
    >
      {contextHolder}
      Create Order
    </Button>
  );
}
