import * as isIPFS from "is-ipfs";

export function useNft() {}

export class NftHelper {
  static nftImageUrl(imageUrl?: string) {
    if (!imageUrl) return;

    // fix invalid ipfs url in general
    if (imageUrl.startsWith("https://ipfs.io/ipfs/ipfs/"))
      imageUrl = imageUrl.replace(
        "https://ipfs.io/ipfs/ipfs/",
        "https://ipfs.io/ipfs/"
      );

    // case ipfs protocol
    if (imageUrl.startsWith("ipfs://")) {
      if (imageUrl.startsWith("ipfs://ipfs/")) {
        return `https://ipfs.io/ipfs/${imageUrl?.split("ipfs://ipfs/")[1]}`;
      } else {
        return `https://ipfs.io/ipfs/${imageUrl?.split("ipfs://")[1]}`;
      }
    }

    if (isIPFS.cid(imageUrl)) return `https://ipfs.io/ipfs/${imageUrl}`;

    // case arweave protocll
    if (imageUrl.startsWith("ar://"))
      return `https://arweave.net/${imageUrl?.split("ar://")[1]}`;

    // case svg encode tags
    if (imageUrl?.startsWith("%3Csvg%20"))
      return `data:image/svg+xml;utf8,${imageUrl}`;

    // case svg decode tags
    if (imageUrl?.startsWith("<svg"))
      return `data:image/svg+xml;utf8,${encodeURIComponent(imageUrl)}`;

    // when ankr can't derive image url (e.g. from opensea nft hosting)
    if (imageUrl === "https://ipfs.io/ipfs/") return undefined;

    // case default
    return imageUrl;
  }
}
