import { Button } from "antd";
import { useState } from "react";
import { useDrafting } from "../lib/drafting";
import { SeaportPlayground } from "../lib/seaport";
import { OrderDraftModal } from "../layout/OrderDraftModal";

export function OrderCreateButton() {
  const [open, setOpen] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  return (
    <>
      {/* Create Order Form */}
      {draftId && (
        <OrderDraftModal
          mode="create"
          draftId={draftId}
          open={open}
          setOpen={setOpen}
          onCanceling={(draftId) => {
            setDraftId(null);
          }}
        />
      )}
      {/* Create Order Button */}
      <Button
        icon={"📣"}
        onClick={async () => {
          const sp = await SeaportPlayground.init();
          const { id } = useDrafting.getState().newCreateOrder({
            title: "",
            chainId: sp.chainId,
          });
          setDraftId(id);
          setOpen(true);
        }}
      >
        Create Order
      </Button>
    </>
  );
}

// export function OrderCreateButton() {
//   const [api, contextHolder] = notification.useNotification();
//   const { create, creating } = useOrders();
//   return (
//     <Button
//       type="primary"
//       loading={creating}
//       onClick={async () => {
//         try {
//           await create(({ offerer }) => ({
//             offer: [
//               {
//                 itemType: ItemType.ERC721,
//                 token: "0x09a473439deB547fAc88d5655fb69e000D2efe5A",
//                 identifier:
//                   "2218958502915401787612776207602548135263838775715842798634660580556841",
//               },
//             ],
//             consideration: [
//               {
//                 amount: ethers.parseEther("0.5").toString(),
//                 recipient: offerer,
//               },
//             ],
//           }));
//         } catch (e: any) {
//           if (e.message?.startsWith("user rejected action")) return;
//           api["error"]({
//             message: "Fail to create order",
//             description: e.message,
//           });
//         }
//       }}
//       icon={"📣"}
//     >
//       {contextHolder}
//       Create Order
//     </Button>
//   );
// }
