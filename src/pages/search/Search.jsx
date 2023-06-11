import { useEffect, useState } from 'react'
import { usePageTitle } from '../../hooks'
import {
  searchItem,
  searchItemAuction,
  searchItemFixedPrice,
  searchItemAddress,
  searchCollection,
} from '../../api'
import { ItemCard } from '../../components/item-card/ItemCard'
import { CollectionCard } from '../../components/collection-card'
import { useSearchParams } from 'react-router-dom'

const SEARCH_KEY = {
  NFTs: 'NFTs',
  Collections: 'Collections',
  FixedPrice: 'FixedPrice',
  Auction: 'Auction',
}

function Search({ pageTitle, keyword, setKeyword }) {
  usePageTitle(pageTitle)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState(SEARCH_KEY.NFTs)
  const [itemList, setItemList] = useState([])
  const [collectionList, setCollectionList] = useState([])

  const handleFilter = (key) => {
    setFilter(key)
  }

  useEffect(() => {
    const keywordSearch = searchParams.get('keyword')
    if (!keyword && keywordSearch) {
      setSearchParams({ keyword: keywordSearch })
      setKeyword(keywordSearch)
    } else setSearchParams({ keyword })
  }, [keyword])

  useEffect(() => {
    const getItemList = async () => {
      try {
        let items, collections
        if (filter === SEARCH_KEY.NFTs) items = (keyword.length === 42) ? await searchItemAddress(keyword) : await searchItem(keyword)
        if (filter === SEARCH_KEY.FixedPrice) items = await searchItemFixedPrice(keyword)
        if (filter === SEARCH_KEY.Auction) items = await searchItemAuction(keyword)
        if (filter === SEARCH_KEY.Collections) collections = await searchCollection(keyword)
        if (filter !== SEARCH_KEY.Collections) {
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
      <h2 className='pt-5'>Search results</h2>
      <hr className="hr" />
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }} className='scrollbar-hidden'>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === SEARCH_KEY.NFTs) && 'disabled'}`}
          onClick={() => handleFilter(SEARCH_KEY.NFTs)}
        >
          NFTs
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === SEARCH_KEY.Collections) && 'disabled'}`}
          onClick={() => handleFilter(SEARCH_KEY.Collections)}
        >
          Collections
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === SEARCH_KEY.FixedPrice) && 'disabled'}`}
          onClick={() => handleFilter(SEARCH_KEY.FixedPrice)}
        >
          Fixed price
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === SEARCH_KEY.Auction) && 'disabled'}`}
          onClick={() => handleFilter(SEARCH_KEY.Auction)}
        >
          Auction
        </div>
      </div>
      <hr className="hr" />
      <div className='py-3 row'>
        {(filter !== SEARCH_KEY.Collections) && itemList.map(item => <ItemCard item={item} key={item._id} />)}
        {(filter === SEARCH_KEY.Collections) && collectionList.map(collection => <CollectionCard collection={collection} key={collection._id} />)}
      </div>
    </div>
  )
}

export { Search }
