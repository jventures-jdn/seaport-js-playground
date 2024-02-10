/* eslint-disable react-hooks/rules-of-hooks */
import useSWR from "swr/immutable";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";

export class KvApi {
  static URL = "https://seaport-playground.jfin.workers.dev";

  static async allKeyValues() {
    const response = await fetch(`${KvApi.URL}/data`);
    return response.json();
  }

  static async writeKeyValue(key: string, value: string) {
    const response = await fetch(`${KvApi.URL}/data/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
    return response.json();
  }

  static async deleteKey(key: string) {
    const response = await fetch(`${KvApi.URL}/data/${key}`, {
      method: "DELETE",
    });
    return response.json();
  }
}

export function useKvApi() {
  return {
    all: () =>
      useSWR<Record<string, string>>("kv/allKeyValues", KvApi.allKeyValues),
    write: useSWRMutation(
      `kv/write`,
      (key, extra: { arg: { key: string; value: any } }) =>
        KvApi.writeKeyValue(
          extra.arg.key,
          typeof extra.arg.value === "string"
            ? extra.arg.value
            : JSON.stringify(extra.arg.value)
        ),
      {
        onSuccess: () => {
          mutate("kv/allKeyValues");
        },
      }
    ),
    delete: useSWRMutation(
      `kv/delete`,
      (key, extra: { arg: { key: string } }) => KvApi.deleteKey(extra.arg.key),
      {
        onSuccess: () => {
          mutate("kv/allKeyValues");
        },
      }
    ),
  };
}
