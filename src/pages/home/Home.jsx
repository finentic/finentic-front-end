import { useEffect, useState } from 'react'
// import { useEth } from '../../contexts'
import { usePageTitle } from '../../hooks'
// import { BUTTON_STATE, REGEX_NUMBER } from '../../utils'
// import { isAddress, parseUnits, formatUnits } from 'ethers/lib/utils'
// import { ButtonSubmit, Footer } from '../../components'
import ItemCard from './ItemCard'
import { exploreItem } from '../../api'

function Home(props) {
  const { pageTitle } = props
  usePageTitle(pageTitle)

  const [itemList, setItemList] = useState([])

  useEffect(() => {
    const getItemList = async () => {
      try {
        const items = await exploreItem()
        console.log(items)
        setItemList(items.data)
      } catch (error) { }
    }
    getItemList()
    return () => setItemList([])
  }, [])

  return (
    <div>
      <h2 className='px-5 pt-5'>Explore</h2>
      <hr className="hr" />
      <div className='ps-5'>
        <div className='btn btn-secondary me-2 rounded-pill disabled'>NFTs</div>
        <div className='btn btn-secondary me-2  rounded-pill'>Collections</div>
        <div className='btn btn-secondary me-2 rounded-pill'>Buy Now</div>
        <div className='btn btn-secondary me-2 rounded-pill'>Live Auction</div>
      </div>
      <hr className="hr" />
      <div className='py-3 row px-5'>
        {itemList.map(item => <ItemCard item={item} key={item._id} />)}
      </div>
    </div>
  )
}

export { Home }
