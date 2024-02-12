import { Button, Modal } from "antd";
import { useState } from "react";
import { OrderDrafts } from "./Order.Drafts";
import { useDrafting } from "../lib/drafting";

export function OrderDraftsButton() {
  const [open, setOpen] = useState(false);
  const draftsCount = useDrafting((state) => state.hasDrafts());
  return (
    <>
      <Modal
        title="Drafts"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={600}
        footer={<></>}
      >
        {/* Drafts List */}
        <OrderDrafts />
      </Modal>
      {/* Drafts Button */}
      <Button icon="✏️" onClick={() => setOpen(true)}>
        Drafts ({draftsCount})
      </Button>
    </>
  );
}
