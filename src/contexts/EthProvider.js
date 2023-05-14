import { useState, createContext, useEffect, useCallback, useContext, useMemo } from 'react'
import { ethers } from "ethers"
import {
  BLOCK_EXPLORER_URL,
  DEFAULT_CHAIN,
  RPC_URI,
  collectionFactoryContract,
  controlCenterContract,
  marketplaceContract,
  sharedContract,
  vietnameseDong,
} from '../utils'
import { getAccount } from '../api'

const EthContext = createContext()

function EthProvider({ children }) {
  const [eth, setEth] = useState({ account: { _id: ethers.constants.AddressZero } })

  const init = useCallback(
    async () => {
      let provider, signer, network, account
      let ControlCenterContract, CollectionFactoryContract, MarketplaceContract, SharedContract, VietnameseDong
      try {
        if (window.ethereum) {
          provider = new ethers.providers.Web3Provider(window.ethereum)
          const accounts = await provider.send("eth_requestAccounts", [])
          signer = provider.getSigner()
          account = getAccount(accounts[0])
          network = await provider.detectNetwork()

          if (network.chainId !== Number(DEFAULT_CHAIN)) {
            console.error(
              'UNSUPPORTED NETWORK CHAIN ID: ',
              network.chainId,
              '\nREVERT TO AVALANCHE FUJI TESTNET DEFAULT CHAIN ID:',
              Number(DEFAULT_CHAIN)
            )
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x' + Number(DEFAULT_CHAIN).toString(16) }],
              })
            } catch (switchError) {
              // This error code indicates that the chain has not been added to MetaMask.
              if (switchError.code === 4902) await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x' + Number(DEFAULT_CHAIN).toString(16),
                  chainName: 'Fuji (C-Chain)',
                  rpcUrls: [RPC_URI],
                  blockExplorerUrls: [BLOCK_EXPLORER_URL],
                  nativeCurrency: {
                    name: "AVAX",
                    symbol: "AVAX",
                    decimals: 18
                  },
                }],
              })
            }
          }
        } else {
          provider = new ethers.providers.WebSocketProvider(RPC_URI)
          account = getAccount(ethers.constants.AddressZero)
        }
        const contractProvider = signer || provider
        ControlCenterContract = controlCenterContract(contractProvider)
        CollectionFactoryContract = collectionFactoryContract(contractProvider)
        MarketplaceContract = marketplaceContract(contractProvider)
        SharedContract = sharedContract(contractProvider)
        VietnameseDong = vietnameseDong(contractProvider)
      } catch (err) {
        console.error(err)
      }

      account = (await account)?.data

      setEth({
        provider,
        account,
        signer,
        network,
        ControlCenterContract,
        CollectionFactoryContract,
        MarketplaceContract,
        SharedContract,
        VietnameseDong,
      })
    }, [])

  // useEffect(() => {
  //   const isConnected = localStorage.getItem('isConnected')
  //   setIsConnected(isConnected ? false : true)
  // }, [init])

  useEffect(() => {
    const tryInit = async () => {
      try {
        init()
      } catch (err) {
        console.error(err)
      }
    }
    tryInit()
  }, [init])

  useEffect(() => {
    if (window.ethereum) {
      const events = ["chainChanged", "accountsChanged"]
      const handleChange = () => init()
      events.forEach(e => window.ethereum.on(e, handleChange))
      return () => {
        events.forEach(e => window.ethereum.removeListener(e, handleChange))
      }
    }
  }, [init, eth.provider, eth.account])

  const ethContext = useMemo(() => ({ eth }), [eth])

  return (
    <EthContext.Provider value={ethContext}>
      {children}
    </EthContext.Provider>
  )
}

function useEth() {
  return useContext(EthContext)
}

export {
  EthProvider,
  EthContext,
  useEth,
}
