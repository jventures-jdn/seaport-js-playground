import { OrderWithCounter } from "@opensea/seaport-js/lib/types";

export type OrderDataValue = {
  title: string;
  offerer: string;
  chainId: string;
  orderHash: string;
  order: OrderWithCounter;
  nfts: NftTokenData[];
};

export type NftTokenData = {
  blockchain: string;
  name: string;
  description: string;
  tokenId: string;
  tokenUrl: string;
  imageUrl: string;
  collectionName: string;
  symbol: string;
  contractType: "ERC721" | "ERC1155";
  contractAddress: string;
};
