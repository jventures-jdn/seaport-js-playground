import { OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { SeaportPlayground } from "./seaport";

export class Fulfill {
  static async start({ order }: { order: OrderWithCounter }) {
    const sp = await SeaportPlayground.init();
    const { executeAllActions } = await sp.seaport.fulfillOrder({
      order,
    });
    const transaction = await executeAllActions();
    return { transaction };
  }
}
