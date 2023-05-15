import { useEffect, useState } from 'react'
import {
  getAllItemsAuctionListingOfAccount,
  getAllItemsFixedPriceListingOfAccount,
  getAllItemOfCollection,
} from '../../api'
import { ItemCard } from '../../components/item-card/ItemCard'

const COLLECTION_KEY = {
  All: 'All',
  Collections: 'Collections',
  FixedPrice: 'FixedPrice',
  Auction: 'Auction',
}

function CollectionItems({ collectionDetail }) {
  const [filter, setFilter] = useState(COLLECTION_KEY.All)
  const [itemList, setItemList] = useState([])

  const handleFilter = (key) => {
    setFilter(key)
  }

  useEffect(() => {
    const getItemList = async () => {
      try {
        let items
        if (filter === COLLECTION_KEY.All) items = await getAllItemOfCollection(collectionDetail._id)
        if (filter === COLLECTION_KEY.FixedPrice) items = await getAllItemsFixedPriceListingOfAccount(collectionDetail._id)
        if (filter === COLLECTION_KEY.Auction) items = await getAllItemsAuctionListingOfAccount(collectionDetail._id)
        console.log(items)
        setItemList(items.data)
      } catch (error) {
        console.error(error)
      }
    }
    if (collectionDetail._id) getItemList()
    return () => setItemList([])
  }, [collectionDetail, filter])

  return (
    <div className=''>
      <div className='py-4'>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === COLLECTION_KEY.All) && 'disabled'}`}
          onClick={() => handleFilter(COLLECTION_KEY.All)}
        >
          All items
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === COLLECTION_KEY.FixedPrice) && 'disabled'}`}
          onClick={() => handleFilter(COLLECTION_KEY.FixedPrice)}
        >
          Fixed price listing
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === COLLECTION_KEY.Auction) && 'disabled'}`}
          onClick={() => handleFilter(COLLECTION_KEY.Auction)}
        >
          Auction listing
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === COLLECTION_KEY.Collections) && 'disabled'}`}
          onClick={() => handleFilter(COLLECTION_KEY.Collections)}
        >
          Collected
        </div>
        <hr className='hr'/>
      </div>
      <div className='py-3 row'>
        {itemList.map(item => <ItemCard item={item} key={item._id} />)}
      </div>
    </div>
  )
}

export { CollectionItems }
