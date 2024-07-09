import Card from "antd/es/card/Card";
import { ConsiderationItem, OfferItem } from "@opensea/seaport-js/lib/types";
import { ethers } from "ethers";
import { Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { Tokens } from "../lib/tokens";

export function OrderItemErc20(props: {
  orderKey: string;
  chainId: string;
  item: OfferItem | ConsiderationItem;
}) {
  const { chainId, item } = props;
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState<string>();
  const [decimals, setDecimals] = useState<number>();

  useEffect(() => {
    let isMounted = true;

    const fetchTokenData = async () => {
      const _symbol = await Tokens.tokenSymbol(chainId, item.token);
      const _decimals = await Tokens.erc20Decimals(chainId, item.token);
      if (isMounted) {
        setSymbol(_symbol);
        setDecimals(_decimals);
        setLoading(false);
      }
    };

    fetchTokenData();
    return () => {
      isMounted = false; // Cleanup function to avoid setting state if component unmounts
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Card size="small" style={{ fontSize: 18, width: 180 }}>
        Loading...
        <Spin />
      </Card>
    );
  }
  return (
    <Card size="small" style={{ fontSize: 18, width: 180 }}>
      {ethers.formatUnits(item.startAmount, decimals || 18)}
      <Tag color="gold" style={{ fontSize: 18, padding: 5, marginLeft: 5 }}>
        {symbol || item.token}
      </Tag>
    </Card>
  );
}
