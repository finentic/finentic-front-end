import { useEffect, useState } from 'react'
import { usePageTitle } from '../../hooks'
import { exploreItems, exploreItemsAuction, exploreItemsFixedPrice } from '../../api'
import { ItemCard } from '../../components/item-card/ItemCard'

const EXPLORE_KEY = {
  NFTs: 'NFTs',
  Collections: 'Collections',
  FixedPrice: 'FixedPrice',
  Auction: 'Auction',
}

function Home(props) {
  const { pageTitle } = props
  usePageTitle(pageTitle)

  const [filter, setFilter] = useState(EXPLORE_KEY.NFTs)
  const [itemList, setItemList] = useState([])

  const handleFilter = (key) => {
    setFilter(key)
  }

  useEffect(() => {
    const getItemList = async () => {
      try {
        let items
        if (filter === EXPLORE_KEY.NFTs) items = await exploreItems()
        if (filter === EXPLORE_KEY.FixedPrice) items = await exploreItemsFixedPrice()
        if (filter === EXPLORE_KEY.Auction) items = await exploreItemsAuction()
        console.log('items',items)
        setItemList(items.data)
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
      <div>
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
          Fixed price listing
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === EXPLORE_KEY.Auction) && 'disabled'}`}
          onClick={() => handleFilter(EXPLORE_KEY.Auction)}
        >
          Auction listing
        </div>
      </div>
      <hr className="hr" />
      <div className='py-3 row'>
        {itemList.map(item => <ItemCard item={item} key={item._id} />)}
      </div>
    </div>
  )
}

export { Home }
