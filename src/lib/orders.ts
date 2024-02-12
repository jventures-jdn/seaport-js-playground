import { useEffect } from "react";
import { mutate } from "swr";
import useSWR from "swr/immutable";
import useSWRMutation from "swr/mutation";
import { useApi } from "./api";
import { OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { Actions } from "./actions";

export function useOrders() {
  const kvApi = useApi().kv();
  const all = kvApi.all();

  const create = useSWRMutation(
    "orders/create",
    async (
      key,
      extra: {
        arg: {
          title: string;
          input: Parameters<typeof Actions.createOrder>[0];
        };
      }
    ) => ({
      title: extra.arg.title,
      order: await Actions.createOrder(extra.arg.input),
    }),
    {
      onSuccess: async (result) => {
        // write kv
        await kvApi.write.trigger({
          key: result.order.orderHash,
          value: { title: result.title, ...result.order },
        });
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
    create: async (
      title: string,
      input: Parameters<typeof Actions.createOrder>[0]
    ) => {
      return await create.trigger({ title, input });
    },
    creating: create.isMutating || kvApi.write.isMutating,
  };
}
