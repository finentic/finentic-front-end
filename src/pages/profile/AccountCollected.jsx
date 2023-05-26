import { useEffect, useState } from 'react'
import {
  getAllCollectionOfAccount,
  getAllItemsAuctionListingOfAccount,
  getAllItemsFixedPriceListingOfAccount,
  getAllItemsOfAccount,
} from '../../api'
import { ItemCard } from '../../components/item-card/ItemCard'
import { CollectionCard } from '../../components/collection-card'

const COLLECTED_KEY = {
  NFTs: 'NFTs',
  Collections: 'Collections',
  FixedPrice: 'FixedPrice',
  Auction: 'Auction',
}

function AccountCollected({ accountDetail }) {
  const [filter, setFilter] = useState(COLLECTED_KEY.NFTs)
  const [itemList, setItemList] = useState([])
  const [collectionList, setCollectionList] = useState([])

  const handleFilter = (key) => {
    setFilter(key)
  }

  useEffect(() => {
    const getItemList = async () => {
      try {
        let items, collections
        if (filter === COLLECTED_KEY.NFTs) items = await getAllItemsOfAccount(accountDetail._id)
        if (filter === COLLECTED_KEY.Collections) collections = await getAllCollectionOfAccount(accountDetail._id)
        if (filter === COLLECTED_KEY.FixedPrice) items = await getAllItemsFixedPriceListingOfAccount(accountDetail._id)
        if (filter === COLLECTED_KEY.Auction) items = await getAllItemsAuctionListingOfAccount(accountDetail._id)
        if (filter !== COLLECTED_KEY.Collections) {
          setItemList(items.data)
        } else {
          setCollectionList(collections.data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    if (accountDetail._id) getItemList()
    return () => setItemList([])
  }, [accountDetail, filter])

  return (
    <div className=''>
      <div className='p-3' style={{
        background: '#fff',
        backgroundImage: 'linear-gradient(170deg, #fff, #f8f9fa)',
      }}>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === COLLECTED_KEY.NFTs) && 'disabled'}`}
          onClick={() => handleFilter(COLLECTED_KEY.NFTs)}
        >
          NFTs
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === COLLECTED_KEY.Collections) && 'disabled'}`}
          onClick={() => handleFilter(COLLECTED_KEY.Collections)}
        >
          Collections
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === COLLECTED_KEY.FixedPrice) && 'disabled'}`}
          onClick={() => handleFilter(COLLECTED_KEY.FixedPrice)}
        >
          Fixed price listing
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === COLLECTED_KEY.Auction) && 'disabled'}`}
          onClick={() => handleFilter(COLLECTED_KEY.Auction)}
        >
          Auction listing
        </div>
      </div>
      {collectionList.map(collection =>console.log(collection))}
      <div className='py-3 row'>
        {(filter !== COLLECTED_KEY.Collections)
          ? itemList.map(item => <ItemCard item={item} key={item._id} />)
          : collectionList.map(collection => <CollectionCard collection={collection} key={collection._id} />)
        }
      </div>
    </div>
  )
}

export { AccountCollected }
