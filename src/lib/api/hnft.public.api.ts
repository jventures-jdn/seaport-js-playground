/* eslint-disable react-hooks/rules-of-hooks */
import useSWR from "swr/immutable";

export class HNftPublicApi {
  static URL = "https://sbx--public-api-gitlrsbgsq-as.a.run.app";

  static async tokenData(params: {
    blockchain: string;
    contract_address: string;
    token_id: string;
  }) {
    const response = await fetch(
      `${HNftPublicApi.URL}/api/v1/nft/token/raw?blockchain=${params.blockchain}&contract_address=${params.contract_address}&token_id=${params.token_id}`
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
        `hnftPublic/tokenData/${blockchain}/${contract_address}/${token_id}`,
        () =>
          HNftPublicApi.tokenData({ blockchain, contract_address, token_id })
      ),
  };
}
