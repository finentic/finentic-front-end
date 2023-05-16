import { createRef, useEffect, useState } from 'react'
import { usePageTitle } from '../../hooks'
import { ButtonSubmit } from '../../components'
import { useEth } from '../../contexts'
import { BUTTON_STATE, ITEM_STATE, MARKETPLACE_ADDRESS, SHARED_ADDRESS, VIETNAMESE_DONG_ADDRESS, collectionContract, toTokenAddress, toTokenId } from '../../utils'
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
  const eth = useEth()
  const navigate = useNavigate()
  const [itemDetail, setItemDetail] = useState(false)
  const [serviceFeePercent, setServiceFeePercent] = useState('1')

  useEffect(() => {
    const getItemList = async () => {
      try {
        const item = await getItemById(itemId)
        if (eth.MarketplaceContract) {
          const marketServiceFeePercent = await eth.MarketplaceContract.serviceFeePercent()
          setServiceFeePercent(marketServiceFeePercent)
        }
        setItemDetail(item.data)
      } catch (error) {
        console.error(error)
      }
    }
    getItemList()
    return () => setItemDetail(false)
  }, [eth.MarketplaceContract, itemId])

  if (!itemDetail) return null
  const isOwner = (itemDetail.owner._id.toLowerCase() === eth.account._id.toLowerCase())
  if (!isOwner || itemDetail.state !== ITEM_STATE.CREATED) navigate(`/item/${itemDetail._id}`)
  return (<ListForSale
    item={itemDetail}
    key={itemDetail._id}
    serviceFeePercent={serviceFeePercent}
  />)
}

function ListForSale({ item, serviceFeePercent }) {
  const datetimeStart = new Date()
  const datetimeEnded = new Date()
  datetimeStart.setMinutes(datetimeStart.getMinutes() - datetimeStart.getTimezoneOffset() + 5)
  datetimeEnded.setMinutes(datetimeEnded.getMinutes() - datetimeEnded.getTimezoneOffset() + 67)

  const eth = useEth()
  const navigate = useNavigate()
  const ref = createRef();
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
  const [cursor, setCursor] = useState(0)
  const [listingForm, setListingForm] = useState({
    method: 'fixed',
    startTime: datetimeStart.toISOString().slice(0, 16),
    endTime: datetimeEnded.toISOString().slice(0, 16),
    price: '0',
    gap: '1',
  })

  useEffect(() => {
    const input = ref.current
    if (input) input.setSelectionRange(cursor, cursor)
  }, [ref, cursor, listingForm.price])

  const handleInputChange = event => {
    const target = event.target
    let value = target.value
    const name = target.name
    // validate price input
    if (name === 'price') {
      if (!value || Number(value) < 1) value = '0'
      const price = value.replaceAll(',', '')
      if (!/^[0-9]+$/.test(price) || price.length > (78 - 18)) return;
      value = commify(price)
      const offsetValue = (value.length - 1 - listingForm.price.length)
      const offsetCursor = (offsetValue < -2) ? -1 : 0
      setCursor(event.target.selectionStart + (offsetValue < 0 ? offsetCursor : offsetValue))
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
      const CollectionContract = collectionContract(eth.signer, toTokenAddress(item._id))
      const getApproved = await CollectionContract.getApproved(toTokenId(item._id))
      const isApprovedForAll = await CollectionContract.isApprovedForAll(eth.account._id, MARKETPLACE_ADDRESS)
      if (!(getApproved.toLowerCase() === MARKETPLACE_ADDRESS.toLowerCase() || isApprovedForAll)) {
        await CollectionContract.approve(MARKETPLACE_ADDRESS, toTokenId(item._id))
        CollectionContract.on('Approval', async (owner) => (owner.toLowerCase() === eth.account._id) && setButtonState(BUTTON_STATE.DONE))
      } else {
        if (listingForm.method === 'fixed') {
          eth.MarketplaceContract.on('ListForBuyNow',
            (nftContract, tokenId) => (
              nftContract.toLowerCase() === CollectionContract.address.toLowerCase() && tokenId.toString() === toTokenId(item._id)
            ) && navigate(`/item/${item._id}`)
          )
          await eth.MarketplaceContract.listForBuyNow(
            CollectionContract.address.toLowerCase(),
            toTokenId(item._id),
            item.is_phygital,
            VIETNAMESE_DONG_ADDRESS,
            price,
          )
        } else {
          await eth.MarketplaceContract.listForAuction(
            CollectionContract.address.toLowerCase(),
            toTokenId(item._id),
            item.is_phygital,
            startTime,
            endTime,
            VIETNAMESE_DONG_ADDRESS,
            price,
            '1',
          )
          eth.MarketplaceContract.on('ListForAuction',
            (nftContract, tokenId) => (
              nftContract.toLowerCase() === CollectionContract.address.toLowerCase() && tokenId.toString() === toTokenId(item._id)
            ) && navigate(`/item/${item._id}`)
          )
        }
      }
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
              ref={ref}
              handleInputChange={handleInputChange}
            />
          )}

          {(listingForm.method === 'auction') && (
            <ListingAuction
              datetimeStart={datetimeStart}
              datetimeEnded={datetimeEnded}
              listingForm={listingForm}
              handleInputChange={handleInputChange}
              ref={ref}
            />
          )}
          <ListingSummary listingForm={listingForm} serviceFeePercent={serviceFeePercent} />

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
