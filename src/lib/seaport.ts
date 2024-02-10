import { Seaport } from "@opensea/seaport-js";
import { CreateOrderInput } from "@opensea/seaport-js/lib/types";
import { ethers } from "ethers";

export class SeaportPlayground {
  static async init(provider?: any) {
    const _provider = provider || (window as any).ethereum;
    const signer = await new ethers.BrowserProvider(_provider).getSigner();
    const seaport = new Seaport(signer);
    const address = await signer.getAddress();
    const chainId = signer.provider._network.chainId.toString();
    return new SeaportPlayground(seaport, address, chainId);
  }

  private constructor(
    readonly seaport: Seaport,
    readonly address: string,
    readonly chainId: string
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
