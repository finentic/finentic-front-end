import { useEffect, useState } from 'react'
import { usePageTitle } from '../../hooks'
import { ButtonSubmit } from '../../components'
import { useEth } from '../../contexts'
import { BUTTON_STATE, SHARED_ADDRESS, VIETNAMESE_DONG_ADDRESS, getTokenIdFromItemId } from '../../utils'
import { getItemById } from '../../api'
import { useNavigate, useParams } from 'react-router-dom'
import { commify, parseEther } from 'ethers/lib/utils'
import ListingAuction from './ListingAuction'
import ListingFixedPrice from './ListingFixedPrice'
import ListingPreview from './ListingPreview'
import ListingSummary from './ListingSummary'
import ListingOptions from './ListingOptions'


function Listing({ pageTitle }) {
  usePageTitle(pageTitle)
  const { itemId } = useParams()
  const { eth } = useEth()
  const navigate = useNavigate()
  const [itemDetail, setItemDetail] = useState(false)

  useEffect(() => {
    const getItemList = async () => {
      try {
        const item = await getItemById(itemId)
        console.log(item)
        setItemDetail(item.data)
      } catch (error) { }
    }
    getItemList()
    return () => setItemDetail()
  }, [itemId])

  if (!itemDetail) return null
  const isOwner = (itemDetail.owner._id.toLowerCase() === eth.account._id.toLowerCase())
  if (!isOwner || itemDetail.price) navigate(`/item/${itemDetail._id}`)
  return (<ListForSale
    item={itemDetail}
    key={itemDetail._id}
  />)
}

function ListForSale({ item }) {
  const datetimeStart = new Date()
  const datetimeEnded = new Date()
  datetimeStart.setMinutes(datetimeStart.getMinutes() - datetimeStart.getTimezoneOffset() + 1)
  datetimeEnded.setMinutes(datetimeEnded.getMinutes() - datetimeEnded.getTimezoneOffset() + 62)

  const { eth } = useEth()
  const navigate = useNavigate()
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
  const [listingForm, setListingForm] = useState({
    method: 'fixed',
    startTime: datetimeStart.toISOString().slice(0, 16),
    endTime: datetimeEnded.toISOString().slice(0, 16),
    price: '0',
    gap: '1',
  })

  const handleInputChange = event => {
    const target = event.target
    let value = target.value
    const name = target.name
    // validate price input
    if (name === 'price') {
      if (!value || Number(value) < 1) value = '0'
      const price = value.replaceAll(',', '')
      if (!/^[0-9]+$/.test(price)) return;
      value = commify(price)
    }
    setListingForm({ ...listingForm, [name]: value })
  }

  const resetState = () => setButtonState(BUTTON_STATE.ENABLE)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    // Math.floor(new Date(listingForm.startTime).getTime() / 1000.0)
    const price = parseEther(listingForm.price.replaceAll(',', ''))
    const startTime = new Date(listingForm.startTime).getTime() / 1000
    const endTime = new Date(listingForm.endTime).getTime() / 1000
    try {
      if (listingForm.method === 'fixed') await eth.MarketplaceContract.listForBuyNow(
        SHARED_ADDRESS,
        getTokenIdFromItemId(item._id),
        item.is_phygital,
        VIETNAMESE_DONG_ADDRESS,
        price,
      )
      else await eth.MarketplaceContract.listForAuction(
        SHARED_ADDRESS,
        getTokenIdFromItemId(item._id),
        item.is_phygital,
        startTime,
        endTime,
        VIETNAMESE_DONG_ADDRESS,
        price,
        '1',
      )
      setButtonState(BUTTON_STATE.DONE)
      navigate(`/item/${item._id}`)
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.REJECTED)
    }
  }


  return (
    <div className='container py-3'>
      <h1 className='fw-bold fs-2'>List for sale</h1>
      <hr className='hr' />
      <div className='row'>

        <form onSubmit={handleSubmit} className='col col-12 col-md-6'>
          <ListingOptions handleInputChange={handleInputChange} />

          {(listingForm.method === 'fixed') && (
            <ListingFixedPrice
              listingForm={listingForm}
              handleInputChange={handleInputChange}
            />
          )}

          {(listingForm.method === 'auction') && (
            <ListingAuction
              datetimeStart={datetimeStart}
              datetimeEnded={datetimeEnded}
              listingForm={listingForm}
              handleInputChange={handleInputChange}
            />
          )}
          <ListingSummary listingForm={listingForm} />

          <div className='py-2'>
            <ButtonSubmit
              buttonState={buttonState}
              resetState={resetState}
              title='Complete listing'
            />
          </div>
        </form>
        <div className='col col-12 col-md-6 p-4'>
          <ListingPreview
            item={item}
            listingForm={listingForm}
          />
        </div>
      </div>
    </div>
  )
}

export { Listing }
