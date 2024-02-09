import useSWR from "swr/immutable";
import useSWRMutation from "swr/mutation";
import { KvApi } from "./api/kv.api";

export function useApi() {
  return {
    kv: useKvApi,
  };
}

export function useKvApi() {
  return {
    all: useSWR("kv/allKeyValues", KvApi.allKeyValues),
    write: useSWRMutation(
      `kv/writeKeyValue`,
      (key, extra: { arg: { key: string; value: string } }) =>
        KvApi.writeKeyValue(extra.arg.key, extra.arg.value)
    ),
    delete: useSWRMutation(
      `kv/deleteKey`,
      (key, extra: { arg: { key: string } }) => KvApi.deleteKey(extra.arg.key)
    ),
  };
}
