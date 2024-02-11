import { useEffect, useMemo } from "react";
import { mutate } from "swr";
import useSWR from "swr/immutable";
import useSWRMutation from "swr/mutation";
import { useApi } from "./api";
import { OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { Offer } from "./offer";
import { OrderDataValue } from "./types";
import { Fulfill } from "./fulfill";

export function useOrders() {
  const kvApi = useApi().kv();
  const all = kvApi.all();

  const create = useSWRMutation(
    "orders/create",
    (key, extra: { arg: { input: Parameters<typeof Offer.start>[0] } }) =>
      Offer.start(extra.arg.input),
    {
      onSuccess: async (result) => {
        // write kv
        await kvApi.write.trigger({
          key: result.orderHash,
          value: { title: "Test Order", ...result },
        });
      },
    }
  );

  const fulfill = useSWRMutation(
    "orders/fulfill",
    (key, extra: { arg: { order: OrderWithCounter } }) =>
      Fulfill.start(extra.arg),
    {
      onSuccess: async () => {
        await kvApi.reload();
      },
    }
  );

  useEffect(() => {
    if (all.data) {
      mutate(
        "orders",
        Object.entries(all.data)
          .map(([key, value]) => {
            try {
              value = JSON.parse(value);
              if (typeof value !== "object" || Array.isArray(value))
                return undefined;
              return { key, value };
            } catch {
              return undefined;
            }
          })
          .filter((i) => !!i)
      );
    }
  }, [all]);
  return {
    ...all,
    orders: useSWR<
      {
        key: string;
        value: any & { order: OrderWithCounter };
      }[]
    >("orders", undefined).data,
    create: async (input: Parameters<typeof Offer.start>[0]) => {
      await create.trigger({ input });
    },
    creating: create.isMutating,
    fulfill: async (order: OrderWithCounter) => {
      await fulfill.trigger({ order });
    },
    fulfilling: fulfill.isMutating,
  };
}

export function useOrder(orderKey: string) {
  const orders = useOrders();
  const raw = useMemo<OrderDataValue>(
    () => orders.orders?.find((o) => o.key === orderKey)?.value,
    [orderKey, orders]
  );
  const { order } = raw;
  const api = useApi().kv();
  const del = async () => {
    await api.delete.trigger({ key: orderKey });
  };
  const deleting = api.delete.isMutating;
  const loading = orders.isLoading || orders.isValidating || deleting;
  return { loading, raw, order, delete: del, deleting };
}
