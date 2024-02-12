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
