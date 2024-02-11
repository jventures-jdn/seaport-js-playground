import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { CreateOrderInput, TipInputItem } from "@opensea/seaport-js/lib/types";

type DraftingState = {
  createOrders: Record<string, CreateOrderDraft>;
  fulfillOrders: Record<string, FulfillOrderDraft>;
  hasDrafts: () => number;
  newCreateOrder: ({ title, chainId }: { title: string; chainId: string }) => {
    id: string;
  };
  updateCreateOrder: (id: string, data: CreateOrderDraft) => void;
  deleteCreateOrder: (id: string) => void;
  clearCreateOrders: () => void;
};

type CreateOrderDraft = {
  title: string;
  chainId: string;
  order: CreateOrderInput;
};

type FulfillOrderDraft = {
  orderHash: string;
  tips?: TipInputItem[];
};

export const useDrafting = create<DraftingState>()(
  // enable redux devtool
  devtools(
    // immer middleware
    immer(
      // auto write state to local storage
      persist(
        // allow subscription with selector
        subscribeWithSelector((set, get) => ({
          createOrders: {},
          fulfillOrders: {},
          hasDrafts: () => {
            return (
              Object.keys(get().createOrders).length +
              Object.keys(get().fulfillOrders).length
            );
          },
          newCreateOrder: ({ title, chainId }) => {
            const id = Math.random().toString(36).substring(2, 12);
            set((state) => {
              state.createOrders[id] = {
                title,
                chainId,
                order: { offer: [], consideration: [] },
              };
            });
            return { id };
          },
          updateCreateOrder: (id: string, data: CreateOrderDraft) => {
            set((state) => {
              state.createOrders[id] = data as any;
            });
          },
          deleteCreateOrder: (id: string) => {
            set((state) => {
              delete state.createOrders[id];
            });
          },
          clearCreateOrders: () => {
            set((state) => {
              state.createOrders = {};
            });
          },
        })),
        {
          // local storage key
          name: "seaport-pg-drafts",
        }
      )
    )
  )
);
