import { ItemType } from "@opensea/seaport-js/lib/constants";
import { ConsiderationItem, OfferItem } from "@opensea/seaport-js/lib/types";
import { useOrder } from "../lib/order";
import { useMemo } from "react";
import { OrderItemNft } from "./Order.Item.Nft";
import { OrderItemNative } from "./Order.Item.Native";
import { OrderItemErc20 } from "./Order.Item.Erc20";

export function OrderItem(props: {
  orderKey: string;
  item: OfferItem | ConsiderationItem;
}) {
  const { orderKey, item } = props;
  const { raw } = useOrder(orderKey);
  const nft = useMemo(() => {
    if (
      item.itemType === ItemType.ERC721 ||
      item.itemType === ItemType.ERC1155
    ) {
      return raw.nfts?.find(
        (nft: any) =>
          nft.tokenId === item.identifierOrCriteria &&
          nft.contractAddress === item.token
      );
    }
  }, [item, raw.nfts]);
  return (
    <div>
      {nft && <OrderItemNft orderKey={orderKey} nft={nft} />}
      {item.itemType === ItemType.NATIVE && (
        <OrderItemNative orderKey={orderKey} item={item} />
      )}
      {item.itemType === ItemType.ERC20 && (
        <OrderItemErc20 orderKey={orderKey} item={item} />
      )}
    </div>
  );
}
