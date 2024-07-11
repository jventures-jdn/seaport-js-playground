import {
  CreateOrderInput,
  OrderWithCounter,
} from "@opensea/seaport-js/lib/types";
import { SeaportPlayground } from "./seaport";
import { Blockchain } from "./blockchain";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { HNftPublicApi } from "./api/hnft.public.api";
import { NftHelper } from "./nfts";

export class Actions {
  static async createOrder(
    input: (context: { offerer: string }) => CreateOrderInput
  ) {
    const sp = await SeaportPlayground.init();
    const { order, orderHash } = await sp.createOffChainOrder(
      input({ offerer: sp.address })
    );

    const nfts: Record<string, any> = {};
    const blockchain = Blockchain.chainIdToBlockchainId(sp.chainId);
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

  static async fulfill({
    order,
    recipient,
    fulfiller,
  }: {
    order: OrderWithCounter;
    recipient?: string;
    // custom seaport wrapper address to act as fulfiller
    fulfiller?: string;
  }) {
    const sp = await SeaportPlayground.init(undefined, fulfiller);
    const { actions } = await sp.seaport.fulfillOrder({
      order,
      recipientAddress: recipient,
      accountAddress: fulfiller,
    });
    const transactions = [];
    for (const action of actions) {
      const transaction = await action.transactionMethods.transact();
      const receipt = await sp.provider.waitForTransaction(transaction.hash, 1);
      transactions.push({ transaction, receipt });
    }
    return { actions, transactions };
  }
}
