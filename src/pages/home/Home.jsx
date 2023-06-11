import { useEffect, useState } from 'react'
import { usePageTitle } from '../../hooks'
import { exploreItems, exploreItemsAuction, exploreItemsFixedPrice, getAllCollections } from '../../api'
import { ItemCard } from '../../components/item-card/ItemCard'
import { CollectionCard } from '../../components/collection-card'

const EXPLORE_KEY = {
  NFTs: 'NFTs',
  Collections: 'Collections',
  FixedPrice: 'FixedPrice',
  Auction: 'Auction',
}

function Home({ pageTitle }) {
  usePageTitle(pageTitle)

  const [filter, setFilter] = useState(EXPLORE_KEY.NFTs)
  const [itemList, setItemList] = useState([])
  const [collectionList, setCollectionList] = useState([])

  const handleFilter = (key) => {
    setFilter(key)
  }

  useEffect(() => {
    const getItemList = async () => {
      try {
        let items, collections
        if (filter === EXPLORE_KEY.NFTs) items = await exploreItems()
        if (filter === EXPLORE_KEY.FixedPrice) items = await exploreItemsFixedPrice()
        if (filter === EXPLORE_KEY.Auction) items = await exploreItemsAuction()
        if (filter === EXPLORE_KEY.Collections) collections = await getAllCollections()
        if (filter !== EXPLORE_KEY.Collections) {
          setItemList(items.data)
        } else {
          setCollectionList(collections.data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getItemList()
    return () => setItemList([])
  }, [filter])

  return (
    <div className='container'>
      <h2 className='pt-5'>Explore</h2>
      <hr className="hr" />
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }} className='scrollbar-hidden'>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === EXPLORE_KEY.NFTs) && 'disabled'}`}
          onClick={() => handleFilter(EXPLORE_KEY.NFTs)}
        >
          NFTs
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === EXPLORE_KEY.Collections) && 'disabled'}`}
          onClick={() => handleFilter(EXPLORE_KEY.Collections)}
        >
          Collections
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === EXPLORE_KEY.FixedPrice) && 'disabled'}`}
          onClick={() => handleFilter(EXPLORE_KEY.FixedPrice)}
        >
          Fixed price
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === EXPLORE_KEY.Auction) && 'disabled'}`}
          onClick={() => handleFilter(EXPLORE_KEY.Auction)}
        >
          Auction
        </div>
      </div>
      <hr className="hr" />
      <div className='py-3 row'>
        {(filter !== EXPLORE_KEY.Collections) && itemList.map(item => <ItemCard item={item} key={item._id} />)}
        {(filter === EXPLORE_KEY.Collections) && collectionList.map(collection => <CollectionCard collection={collection} key={collection._id} />)}
      </div>
    </div>
  )
}

export { Home }
