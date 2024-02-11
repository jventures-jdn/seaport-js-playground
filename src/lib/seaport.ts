import { Seaport } from "@opensea/seaport-js";
import { CreateOrderInput } from "@opensea/seaport-js/lib/types";
import { BrowserProvider, ethers } from "ethers";

export class SeaportPlayground {
  static async initReadonly(provider?: any) {
    const _provider = provider || (window as any).ethereum;
    const __provider = new ethers.BrowserProvider(_provider);
    const seaport = new Seaport(__provider as any);
    return new SeaportPlayground(seaport, "", "", __provider);
  }

  static async init(provider?: any) {
    const _provider = provider || (window as any).ethereum;
    const __provider = new ethers.BrowserProvider(_provider);
    const signer = await __provider.getSigner();
    const seaport = new Seaport(signer);
    const address = await signer.getAddress();
    const chainId = signer.provider._network.chainId.toString();
    return new SeaportPlayground(seaport, address, chainId, __provider);
  }

  private constructor(
    readonly seaport: Seaport,
    readonly address: string,
    readonly chainId: string,
    readonly provider: BrowserProvider
  ) {}

  async createOffChainOrder(order: CreateOrderInput) {
    const { executeAllActions } = await this.seaport.createOrder(
      order,
      this.address
    );
    const _order = await executeAllActions();
    const orderHash = this.seaport.getOrderHash(_order.parameters);
    return { order: _order, orderHash };
  }
}
