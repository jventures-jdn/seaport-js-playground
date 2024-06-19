import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import {
  CreateInputItem,
  CreateOrderInput,
  TipInputItem,
} from "@opensea/seaport-js/lib/types";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { ethers } from "ethers";

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
  toCreateInputItem: (
    draftItem: OrderItemDraft,
    recipient?: string
  ) => CreateInputItem;
};

type OrderItemDraft = {
  type: ItemType;
  native_amount: number;
  erc20_contract: string;
  erc20_amount: number;
  erc721_contract: string;
  erc721_id: string;
  erc1155_contract: string;
  erc1155_id: string;
  erc1155_amount: number;
};

export type CreateOrderDraft = {
  title: string;
  chainId: string;
  order: CreateOrderInput;
  tempOrder: {
    offer: OrderItemDraft[];
    consideration: OrderItemDraft[];
  };
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
          toCreateInputItem: (item, recipient) => {
            switch (item.type) {
              case ItemType.NATIVE:
                const nativeAmount = ethers
                  .parseUnits(item.native_amount?.toString() || "0", "ether")
                  .toString();
                return {
                  amount: nativeAmount,
                  recipient,
                };
              case ItemType.ERC20:
                // TODO: don't hard-code erc20 decimals
                const erc20Amount = ethers
                  .parseUnits(item.erc20_amount?.toString() || "0", 18)
                  .toString();
                return {
                  itemType: ItemType.ERC20,
                  token: item.erc20_contract,
                  amount: erc20Amount,
                  recipient,
                };
              case ItemType.ERC721:
                return {
                  itemType: ItemType.ERC721,
                  token: item.erc721_contract,
                  identifier: item.erc721_id,
                  recipient,
                };
              case ItemType.ERC1155:
                return {
                  itemType: ItemType.ERC1155,
                  token: item.erc1155_contract,
                  identifier: item.erc1155_id,
                  amount: item.erc1155_amount?.toString() || "1",
                  recipient,
                };
              default:
                throw Error(`item type not supported : ${item.type}`);
            }
          },
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
                tempOrder: { offer: [], consideration: [] },
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
