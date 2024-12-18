import { useState } from "react";
import { OrderDraftModal } from "../layout/OrderDraftModal";
import { useDrafting } from "../lib/drafting";
import { Button, Flex } from "antd";

export function OrderDrafts() {
  const createOrders = useDrafting((state) => state.createOrders);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  return (
    <>
      {/* Edit Draft */}
      {
        <OrderDraftModal
          mode="edit"
          draftId={editingDraftId!}
          open={!!editingDraftId}
          setOpen={() => setEditingDraftId(null)}
        />
      }
      {/* Select Draft */}
      <Flex vertical gap="small">
        {Object.entries(createOrders).map(([id, draft]) => (
          <Button key={id} onClick={() => setEditingDraftId(id)}>
            {draft.title || id}
          </Button>
        ))}
      </Flex>
    </>
  );
}
