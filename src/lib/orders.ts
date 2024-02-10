import { useEffect, useMemo } from "react";
import { mutate } from "swr";
import useSWR from "swr/immutable";
import { useApi } from "./api";
import { OrderWithCounter } from "@opensea/seaport-js/lib/types";

export function useOrders() {
  const all = useApi().kv().all();
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
        value: OrderWithCounter;
      }[]
    >("orders", undefined).data,
  };
}

export function useOrder(orderKey: string) {
  const orders = useOrders();
  const order = useMemo(
    () => orders.orders?.find((o) => o.key === orderKey)?.value,
    [orderKey, orders]
  );
  const api = useApi().kv();
  const del = async () => {
    await api.delete.trigger({ key: orderKey });
  };
  const deleting = api.delete.isMutating;
  const loading = orders.isLoading || orders.isValidating || deleting;
  return { loading, order, delete: del, deleting };
}
