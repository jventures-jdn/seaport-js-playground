import { CreateOrderInput } from "@opensea/seaport-js/lib/types";
import { SeaportPlayground } from "./seaport";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { HNftPublicApi } from "./api/hnft.public.api";
import { NftHelper } from "./nfts";

export class Offer {
  static async start(
    createOrder: (context: { offerer: string }) => CreateOrderInput
  ) {
    const sp = await SeaportPlayground.init();
    const { order, orderHash } = await sp.createOffChainOrder(
      createOrder({ offerer: sp.address })
    );

    const nfts: Record<string, any> = {};
    const blockchain = this.chainIdToNetworkName(sp.chainId);
    if (blockchain)
      for (const offer of order.parameters.offer) {
        if (
          offer.itemType === ItemType.ERC721 ||
          offer.itemType === ItemType.ERC1155
        ) {
          const key = `${blockchain}/${offer.token}/${offer.identifierOrCriteria}`;
          if (nfts[key]) continue;
          const tokenData = await HNftPublicApi.tokenData({
            blockchain,
            contract_address: offer.token,
            token_id: offer.identifierOrCriteria,
          });
          if (tokenData?.nft) {
            NftHelper.cacheTokenData(
              blockchain,
              offer.token,
              offer.identifierOrCriteria,
              tokenData
            );
            nfts[key] = tokenData.nft;
          }
        }
      }

    return {
      offerer: sp.address,
      chainId: sp.chainId,
      orderHash,
      order,
      nfts: Object.values(nfts),
    };
  }

  static chainIdToNetworkName(chainId: string) {
    switch (chainId) {
      case "1":
        return "eth";
      case "56":
        return "bsc";
      case "137":
        return "matic";
      case "10":
        return "optimism";
      case "3501":
        return "jfin";
      case "3502":
        return "jfin_testnet";
    }
  }
}
