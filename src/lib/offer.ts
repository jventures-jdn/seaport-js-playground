import { CreateOrderInput } from "@opensea/seaport-js/lib/types";
import { SeaportPlayground } from "./seaport";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { HNftPublicApi } from "./api/hnft.public.api";
import { NftHelper } from "./nfts";
import { Blockchain } from "./blockchain";

export class Offer {
  static async start(
    createOrder: (context: { offerer: string }) => CreateOrderInput
  ) {
    const sp = await SeaportPlayground.init();
    const { order, orderHash } = await sp.createOffChainOrder(
      createOrder({ offerer: sp.address })
    );

    const nfts: Record<string, any> = {};
    const blockchain = Blockchain.chainIdToNetworkName(sp.chainId);
    if (blockchain)
      for (const item of [
        ...order.parameters.offer,
        ...order.parameters.consideration,
      ]) {
        if (
          item.itemType === ItemType.ERC721 ||
          item.itemType === ItemType.ERC1155
        ) {
          const key = `${blockchain}/${item.token}/${item.identifierOrCriteria}`;
          if (nfts[key]) continue;
          const tokenData = await HNftPublicApi.tokenData({
            blockchain,
            contract_address: item.token,
            token_id: item.identifierOrCriteria,
          });
          if (tokenData?.nft) {
            NftHelper.cacheTokenData(
              blockchain,
              item.token,
              item.identifierOrCriteria,
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
}
