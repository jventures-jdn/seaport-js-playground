/* eslint-disable react-hooks/rules-of-hooks */
import { mutate } from "swr";
import useSWR from "swr/immutable";

export class HNftPublicApi {
  static URL = "https://sbx--public-api-gitlrsbgsq-as.a.run.app";
  static TOKEN_DATA_KEY = (
    blockchain: string,
    contract_address: string,
    token_id: string
  ) => `hnftPublic/tokenData/${blockchain}/${contract_address}/${token_id}`;

  static async tokenData(params: {
    blockchain: string;
    contract_address: string;
    token_id: string;
  }) {
    const response = await fetch(
      `${HNftPublicApi.URL}/api/v1/nft/token?blockchain=${params.blockchain}&contract_address=${params.contract_address}&token_id=${params.token_id}`
    );
    return response.json();
  }
}

export function useHNftPublicApi() {
  return {
    tokenData: (
      blockchain: string,
      contract_address: string,
      token_id: string
    ) =>
      useSWR<Record<string, string>>(
        HNftPublicApi.TOKEN_DATA_KEY(blockchain, contract_address, token_id),
        () =>
          HNftPublicApi.tokenData({ blockchain, contract_address, token_id })
      ),
  };
}
