import { ethers } from "ethers";
import { LRUCache } from "lru-cache";
import { Blockchain } from "./blockchain";

export class Tokens {
  static cache = new LRUCache({ max: 1000 });

  static async contractName(chainId: string, address: string): Promise<string> {
    return await this._call(
      chainId,
      address,
      ["function name() view returns (string)"],
      "name"
    );
  }

  static async tokenSymbol(chainId: string, address: string): Promise<string> {
    return await this._call(
      chainId,
      address,
      ["function symbol() view returns (string)"],
      "symbol"
    );
  }

  static async erc20Decimals(
    chainId: string,
    address: string
  ): Promise<number> {
    const result = await this._call(
      chainId,
      address,
      ["function decimals() view returns (uint8)"],
      "decimals"
    );
    return Number(result) ?? 18;
  }

  static async nftUri(
    chainId: string,
    address: string,
    tokenId: string,
    type: "erc721" | "erc1155"
  ) {
    return await this._call(
      chainId,
      address,
      [
        `function tokenURI(uint256 tokenId) view returns (string)`,
        `function uri(uint256 tokenId) view returns (string)`,
      ],
      type === "erc721" ? "tokenURI" : "uri",
      tokenId
    );
  }

  private static _provider(chainId: string) {
    const rpcEndpoint = Blockchain.chainIdToPublicRpc(chainId);
    if (!rpcEndpoint) throw new Error(`Unknown chain id: ${chainId}`);
    return new ethers.JsonRpcProvider(rpcEndpoint);
  }

  private static _contract(chainId: string, address: string, abi: any) {
    return new ethers.Contract(address, abi, Tokens._provider(chainId));
  }

  private static async _call(
    chainId: string,
    address: string,
    abi: any,
    method: string,
    params?: any
  ) {
    const key = `${chainId}-${address}-${method}${params ? `-${params}` : ""}`;
    const cached = this.cache.get(key);
    if (cached) return cached;

    const contract = this._contract(chainId, address, abi);
    let result;
    try {
      if (params) result = await contract[method](params);
      else result = await contract[method]();
      this.cache.set(key, result);
      return result;
    } catch (e) {
      return null;
    }
  }
}
