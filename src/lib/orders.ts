import { useEffect, useMemo, useState } from "react";
import { mutate } from "swr";
import useSWR from "swr/immutable";
import { useApi } from "./api";
import { OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { Offer } from "./offer";
import { OrderDataValue } from "./types";

export function useOrders() {
  const kvApi = useApi().kv();
  const all = kvApi.all();
  const [submitting, setSubmitting] = useState(false);
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
    submit: async (createOrder: Parameters<typeof Offer.start>[0]) => {
      try {
        setSubmitting(true);
        // sign order and prepare additional data
        const result = await Offer.start(createOrder);

        // write kv
        await kvApi.write.trigger({
          key: result.orderHash,
          value: { title: "Test Order", ...result },
        });
      } finally {
        setSubmitting(false);
      }
    },
    submitting,
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
