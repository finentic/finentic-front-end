import { useEffect, useState } from 'react'
import {
  getAllOrdersOfAccount,
} from '../../api'
import { ItemCard } from '../../components/item-card/ItemCard'

const SALES_KEY = {
  All: 'All',
  Shipping: 'Shipping',
  Completed: 'Completed',
  Canceled: 'Canceled',
}

function AccountSales({ accountDetail }) {
  const [filter, setFilter] = useState(SALES_KEY.All)
  const [itemList, setItemList] = useState([])

  const handleFilter = (key) => {
    setFilter(key)
  }

  useEffect(() => {
    const getItemList = async () => {
      try {
        let items
        if (filter === SALES_KEY.All) items = await getAllOrdersOfAccount(accountDetail._id)
        if (filter === SALES_KEY.Shipping) items = await getAllOrdersOfAccount(accountDetail._id)
        if (filter === SALES_KEY.Completed) items = await getAllOrdersOfAccount(accountDetail._id)
        if (filter === SALES_KEY.Canceled) items = await getAllOrdersOfAccount(accountDetail._id)
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
      <div className='p-3' style={{
        background: '#fff',
        backgroundImage: 'linear-gradient(180deg, #fff, #f8f9fa)',
      }}>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === SALES_KEY.All) && 'disabled'}`}
          onClick={() => handleFilter(SALES_KEY.All)}
        >
          All orders
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === SALES_KEY.Shipping) && 'disabled'}`}
          onClick={() => handleFilter(SALES_KEY.Shipping)}
        >
          Shipping
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === SALES_KEY.Completed) && 'disabled'}`}
          onClick={() => handleFilter(SALES_KEY.Completed)}
        >
          Completed
        </div>
        <div
          className={`btn btn-secondary me-2 rounded-pill ${(filter === SALES_KEY.Canceled) && 'disabled'}`}
          onClick={() => handleFilter(SALES_KEY.Canceled)}
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

export { AccountSales }
