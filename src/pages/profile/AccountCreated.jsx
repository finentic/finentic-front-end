import { useEffect, useState } from 'react'
import {
  getAllCollectionOfAccount,
  getAllItemsCreatedOfAccount,
} from '../../api'
import { ItemCard } from '../../components/item-card/ItemCard'
import { CollectionCard } from '../../components/collection-card'

const CREATED_KEY = {
  NFTs: 'NFTs',
  Collections: 'Collections',
}

function AccountCreated({ accountDetail }) {
  const [filter, setFilter] = useState(CREATED_KEY.NFTs)
  const [itemList, setItemList] = useState([])
  const [collectionList, setCollectionList] = useState([])

  const handleFilter = (key) => {
    setFilter(key)
  }

  useEffect(() => {
    const getItemList = async () => {
      try {
        let items, collections
        if (filter === CREATED_KEY.NFTs) items = await getAllItemsCreatedOfAccount(accountDetail._id)
        if (filter === CREATED_KEY.Collections) collections = await getAllCollectionOfAccount(accountDetail._id)
        if (filter !== CREATED_KEY.Collections) {
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
        backgroundImage: 'linear-gradient(180deg, #fff, #f8f9fa)',
      }}>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === CREATED_KEY.NFTs) && 'disabled'}`}
          onClick={() => handleFilter(CREATED_KEY.NFTs)}
        >
          NFTs
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === CREATED_KEY.Collections) && 'disabled'}`}
          onClick={() => handleFilter(CREATED_KEY.Collections)}
        >
          Collections
        </div>
      </div>
      <div className='py-3 row'>
        {(filter !== CREATED_KEY.Collections)
          ? itemList.map(item => <ItemCard item={item} key={item._id} />)
          : collectionList.map(collection => <CollectionCard collection={collection} key={collection._id} />)
        }
      </div>
    </div>
  )
}

export { AccountCreated }
