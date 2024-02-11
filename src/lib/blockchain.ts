export class Blockchain {
  static chainIdToBlockchainId(chainId: string) {
    switch (chainId) {
      case "1":
        return "eth";
      case "56":
        return "bsc";
      case "137":
        return "polygon";
      case "10":
        return "optimism";
      case "3501":
        return "jfin";
      case "3502":
        return "jfin_testnet";
    }
  }

  static chainIdToBlockchainName(chainId: string) {
    switch (chainId) {
      case "1":
        return "Ethereum";
      case "56":
        return "BSC";
      case "137":
        return "Polygon";
      case "10":
        return "Optimism";
      case "3501":
        return "Jfin Chain";
      case "3502":
        return "Jfin Chain Testnet";
    }
  }

  static chainIdToNativeCurrency(chainId: string) {
    switch (chainId) {
      case "1":
        return "ETH";
      case "56":
        return "BNB";
      case "137":
        return "MATIC";
      case "10":
        return "ETH";
      case "3501":
        return "JFIN";
      case "3502":
        return "JFIN";
    }
  }

  static nftTokenUrl(
    chainId: string,
    contractAddress: string,
    tokenId: string
  ) {
    switch (chainId) {
      case "1":
        return `https://etherscan.io/nft/${contractAddress}/${tokenId}`;
      case "56":
        return `https://bscscan.com/nft/${contractAddress}/${tokenId}`;
      case "137":
        return `https://polygonscan.com/nft/${contractAddress}/${tokenId}`;
      case "10":
        return `https://optimistic.etherscan.io/token/${contractAddress}?a=${tokenId}`;
      case "3501":
        return `https://jfinscan.com/token/${contractAddress}/instance/${tokenId}`;
      case "3502":
        return `https://testnet.jfinscan.com/token/${contractAddress}/instance/${tokenId}`;
    }
  }
}
