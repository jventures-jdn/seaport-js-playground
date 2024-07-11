import { useMemo } from "react";
import { useOrders } from "./orders";
import { useApi } from "./api";
import { mutate } from "swr";
import useSWR from "swr/immutable";
import useSWRMutation from "swr/mutation";
import { OrderDataValue } from "./types";
import { SeaportPlayground } from "./seaport";
import { Actions } from "./actions";

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
  const status = () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSWR(`orders/${orderKey}/status`, async () => {
      const sp = await SeaportPlayground.initReadonly(raw.chainId);
      return await sp.seaport.getOrderStatus(orderKey);
    });

  const fulfill = useSWRMutation(
    `orders/${orderKey}/fulfill`,
    async (
      key,
      {
        arg: { recipient, fulfiller },
      }: { arg: { recipient?: string; fulfiller?: string } }
    ) => await Actions.fulfill({ order, recipient, fulfiller }),
    {
      onSuccess: async () => {
        // clear order status
        await mutate(`orders/${orderKey}/status`, undefined);
      },
    }
  );

  const validate = useSWRMutation(
    `orders/${orderKey}/validate`,
    async () => {
      const sp = await SeaportPlayground.init();
      const transaction = await sp.seaport.validate([order]).transact();
      const receipt = await sp.provider.waitForTransaction(transaction.hash, 1);
      return { transaction, receipt };
    },
    {
      onSuccess: async () => {
        // clear order status
        await mutate(`orders/${orderKey}/status`, undefined);
      },
    }
  );

  const cancel = useSWRMutation(
    `orders/${orderKey}/cancel`,
    async () => {
      const sp = await SeaportPlayground.init();
      const transaction = await sp.seaport
        .cancelOrders([order.parameters])
        .transact();
      const receipt = await sp.provider.waitForTransaction(transaction.hash, 1);
      return { transaction, receipt };
    },
    {
      onSuccess: async () => {
        // clear order status
        await mutate(`orders/${orderKey}/status`, undefined);
      },
    }
  );

  return {
    loading,
    raw,
    order,
    delete: del,
    deleting,
    status,
    fulfill,
    validate,
    cancel,
  };
}
