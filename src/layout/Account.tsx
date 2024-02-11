import { Button, Flex, Tag } from "antd";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { Blockchain } from "../lib/blockchain";

export function Account() {
  const ethereum = (window as any).ethereum;
  const [warn, setWarn] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const account = useMemo(() => accounts[0], [accounts]);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [networkId, setNetworkId] = useState("");
  const blockchain = useMemo(
    () => Blockchain.chainIdToBlockchainName(networkId),
    [networkId]
  );
  useEffect(() => {
    if (ethereum) {
      const provider = new ethers.BrowserProvider(ethereum);
      const updateAccounts = (accounts: any[]) => {
        setAccounts(accounts);
        if (accounts.length) updateBalance(accounts[0]);
      };
      const updateBalance = (account: string) => {
        if (!account) return;
        provider.getBalance(account).then((balance: bigint) => {
          setBalance(balance);
        });
      };
      const updateNetwork = () => {
        provider.getNetwork().then((network: any) => {
          setNetworkId(network.chainId.toString());
        });
      };

      // detect Metamask account change
      ethereum.on("accountsChanged", updateAccounts);

      // detect Network account change
      ethereum.on("networkChanged", async function (networkId: any) {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      });

      // stimulate accountsChanged
      ethereum.request({ method: "eth_accounts" }).then(updateAccounts);

      updateNetwork();
    } else {
      setWarn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (warn) return <div>⚠️ No wallet detected</div>;
  if (!account)
    return (
      <Button
        onClick={async () => {
          try {
            await ethereum.request({ method: "eth_requestAccounts" });
          } catch {}
        }}
      >
        Connect
      </Button>
    );
  return (
    <Flex align="center" gap="small" wrap="wrap">
      <span style={{ fontSize: 14 }}>{account}</span>
      <Tag color="blue">
        <>{blockchain || `Network : ${networkId}`}</>
      </Tag>
      <Tag>
        {ethers.formatEther(balance)}{" "}
        {Blockchain.chainIdToNativeCurrency(networkId)}
      </Tag>
    </Flex>
  );
}
