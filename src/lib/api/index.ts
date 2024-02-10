import { useHNftPublicApi } from "./hnft.public.api";
import { useKvApi } from "./kv.api";

export function useApi() {
  return {
    kv: useKvApi,
    hnftPublic: useHNftPublicApi,
  };
}
