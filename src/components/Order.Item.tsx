import { ItemType } from "@opensea/seaport-js/lib/constants";
import { ConsiderationItem, OfferItem } from "@opensea/seaport-js/lib/types";
import { useOrder } from "../lib/orders";
import { useMemo } from "react";
import { OrderItemNft } from "./Order.Item.Nft";

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
  return <div>{nft && <OrderItemNft orderKey={orderKey} nft={nft} />}</div>;
}
