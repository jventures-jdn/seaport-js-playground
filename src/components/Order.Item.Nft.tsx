import { Card } from "antd";
import { NftHelper } from "../lib/nfts";
import { ImageFallback } from "../ui-kit/ImageFallback";
import { useOrder } from "../lib/orders";
import { NftTokenData } from "../lib/types";

export function OrderItemNft(props: { orderKey: string; nft: NftTokenData }) {
  const { orderKey, nft } = props;
  const { raw } = useOrder(orderKey);
  return (
    <Card
      hoverable
      style={{ width: 180 }}
      onClick={() => {
        window.open(
          NftHelper.nftTokenUrl(raw.chainId, nft.contractAddress, nft.tokenId),
          "_blank"
        );
      }}
      cover={
        <ImageFallback
          src={NftHelper.nftImageUrl(nft?.imageUrl)}
          alt={nft?.name}
        />
      }
    >
      <Card.Meta
        style={{ margin: -15 }}
        title={nft?.name}
        description={nft?.description}
      />
    </Card>
  );
}
