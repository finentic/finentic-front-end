import { useState, createContext, useEffect, useCallback, useContext, useMemo } from 'react'
import { ethers } from "ethers"
import {
  DEFAULT_CHAIN,
  RPC_URI,
  collectionFactoryContract,
  controlCenterContract,
  marketplaceContract,
  sharedContract,
} from '../utils'
import { getAccount } from '../api'

const EthContext = createContext()

function EthProvider({ children }) {
  const [eth, setEth] = useState({ artifacts: undefined })

  const init = useCallback(
    async artifacts => {
      let provider, signer, network, account
      let ControlCenterContract, CollectionFactoryContract, MarketplaceContract, SharedContract
      try {
        if (window.ethereum) {
          provider = new ethers.providers.Web3Provider(window.ethereum)
          const accounts = await provider.send("eth_requestAccounts", [])
          signer = provider.getSigner()
          account = (await getAccount(accounts[0])).data
        } else {
          provider = new ethers.providers.JsonRpcProvider(RPC_URI)
        }
        network = await provider.detectNetwork()
        const signerContract = signer || provider

        ControlCenterContract = controlCenterContract(signerContract)
        CollectionFactoryContract = collectionFactoryContract(signerContract)
        MarketplaceContract = marketplaceContract(signerContract)
        SharedContract = sharedContract(signerContract)

        // eslint-disable-next-line eqeqeq
        if (network.chainId != DEFAULT_CHAIN) console.error(
          'UNSUPPORTED NETWORK CHAIN ID: ',
          network.chainId,
          '\nREVERT TO AVALANCHE FUJI TESTNET DEFAULT CHAIN ID:',
          Number(DEFAULT_CHAIN)
        )
      } catch (err) {
        console.error(err)
      }
      setEth({
        artifacts,
        provider,
        account,
        signer,
        network,
        ControlCenterContract,
        CollectionFactoryContract,
        MarketplaceContract,
        SharedContract,
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
      const handleChange = () => init(eth.artifacts)
      events.forEach(e => window.ethereum.on(e, handleChange))
      return () => {
        events.forEach(e => window.ethereum.removeListener(e, handleChange))
      }
    }
  }, [init, eth.artifacts, eth.account])

  const ethContext = useMemo(() => ({ eth, setEth }), [eth])

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
