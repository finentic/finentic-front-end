import { useEffect, useState } from 'react'
import {
  getAllPurchaseItemsOfAccount,
  getAllShippingPurchaseItemsOfAccount,
  getAllDeliveredPurchaseItemsOfAccount,
  getAllCanceledPurchaseItemsOfAccount,
} from '../../api'
import { ItemCard } from '../../components/item-card/ItemCard'

const PURCHASE_KEY = {
  All: 'All',
  Shipping: 'Shipping',
  Completed: 'Completed',
  Canceled: 'Canceled',
}

function AccountPurchase({ accountDetail }) {
  const [filter, setFilter] = useState(PURCHASE_KEY.All)
  const [itemList, setItemList] = useState([])

  const handleFilter = (key) => {
    setFilter(key)
  }

  useEffect(() => {
    const getItemList = async () => {
      try {
        let items
        if (filter === PURCHASE_KEY.All) items = await getAllPurchaseItemsOfAccount(accountDetail._id)
        if (filter === PURCHASE_KEY.Shipping) items = await getAllShippingPurchaseItemsOfAccount(accountDetail._id)
        if (filter === PURCHASE_KEY.Completed) items = await getAllDeliveredPurchaseItemsOfAccount(accountDetail._id)
        if (filter === PURCHASE_KEY.Canceled) items = await getAllCanceledPurchaseItemsOfAccount(accountDetail._id)
        console.log(items)
        setItemList(items.data)
      } catch (error) {
        console.error(error)
      }
    }
    if (accountDetail._id) getItemList()
    return () => setItemList([])
  }, [accountDetail, filter])

  return (
    <div className=''>
      <div
        style={{
          background: '#fff',
          backgroundImage: 'linear-gradient(180deg, #fff, #f8f9fa)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
        className='scrollbar-hidden p-3'
      >
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === PURCHASE_KEY.All) && 'disabled'}`}
          onClick={() => handleFilter(PURCHASE_KEY.All)}
        >
          All orders
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === PURCHASE_KEY.Shipping) && 'disabled'}`}
          onClick={() => handleFilter(PURCHASE_KEY.Shipping)}
        >
          Shipping
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === PURCHASE_KEY.Completed) && 'disabled'}`}
          onClick={() => handleFilter(PURCHASE_KEY.Completed)}
        >
          Completed
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === PURCHASE_KEY.Canceled) && 'disabled'}`}
          onClick={() => handleFilter(PURCHASE_KEY.Canceled)}
        >
          Canceled
        </div>
      </div>
      <div className='py-3 row'>
        {itemList.map(item => <ItemCard item={item} key={item._id} />)}
      </div>
    </div>
  )
}

export { AccountPurchase }
