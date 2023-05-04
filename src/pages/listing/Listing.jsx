import { useEffect, useState } from 'react'
import { usePageTitle } from '../../hooks'
import { ButtonImg, ButtonSubmit } from '../../components'
import { useEth } from '../../contexts'
import { BUTTON_STATE, MARKETPLACE_ADDRESS, PERCENTAGE, toBN, toImgUrl } from '../../utils'
import { getItemById } from '../../api'
import { useParams } from 'react-router-dom'
import { commify } from 'ethers/lib/utils'
import ListingAuction from './ListingAuction'
import ListingFixedPrice from './ListingFixedPrice'


function Listing({ pageTitle }) {
  const { itemId } = useParams()
  usePageTitle(pageTitle)
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
  return (<ListForSale
    item={itemDetail}
    key={itemDetail._id}
  />)
}

function ListForSale({ item }) {
  const { eth } = useEth()
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
  const [listingForm, setListingForm] = useState({
    method: 'fixed',
    startTime: '',
    endTime: '',
    price: '0',
    gap: '0',
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
    console.log(name, value)
    setListingForm({ ...listingForm, [name]: value })
  }

  const resetState = () => setButtonState(BUTTON_STATE.ENABLE)

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Math.floor(new Date(listingForm.startTime).getTime() / 1000.0)
    setButtonState(BUTTON_STATE.PENDING)

    await eth.SharedContract.mintAndApprove(eth.account._id, MARKETPLACE_ADDRESS)
    setButtonState(BUTTON_STATE.DONE)
  }

  return (
    <div className='container py-3'>
      <h1 className='fw-bold fs-2'>List for sale</h1>
      <hr className='hr' />
      <div className='row'>

        <form onSubmit={handleSubmit} className='col col-12 col-md-6'>
          <div className='form-group my-3 row'>
            <span className='fw-bold fs-5'> Choose a type of sale</span>
            <label htmlFor='fixed' className='py-2'>
              <div className='card w-100 p-3 rounded-3 shadow-hover'>
                <div className='row'>
                  <div className='col'>
                    <span className='fw-bold'>
                      Fixed price
                    </span>
                    <br />
                    <small className='text-muted'>
                      The item is listed at the price you set.
                    </small>
                  </div>
                  <div className='col-2 text-end align-middle'>
                    <input
                      name='method'
                      id='fixed'
                      onChange={handleInputChange}
                      type='radio'
                      defaultChecked
                      value='fixed'
                      style={{
                        height: '20px',
                        width: '20px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </label>
            <br />

            <label htmlFor='auction' className='py-2'>
              <div className='card w-100 p-3 rounded-3 shadow-hover'>
                <div className='row'>
                  <div className='col'>
                    <span className='fw-bold'>
                      Timed auction
                    </span>
                    <br />
                    <small className='text-muted'>
                      The item is listed for auction.
                    </small>
                  </div>
                  <div className='col-2 text-end align-middle'>
                    <input
                      name='method'
                      id='auction'
                      value='auction'
                      onChange={handleInputChange}
                      type='radio'
                      style={{
                        height: '20px',
                        width: '20px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </label>
          </div>

          {(listingForm.method === 'fixed') && (
            <ListingFixedPrice
              listingForm={listingForm}
              handleInputChange={handleInputChange}
            />
          )}

          {(listingForm.method === 'auction') && (
            <ListingAuction
              listingForm={listingForm}
              handleInputChange={handleInputChange}
            />
          )}
          <div className='py-3'>
            <p className='fw-bold fs-5'>
              Summary
            </p>
            <div className='row'>
              <div className='col-6'>
                Listing price
              </div>
              <div className='col-6 text-end'>
                {listingForm.price} VND
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                Service fee
              </div>
              <div className='col-6 text-end'>
                0.01 %
              </div>
            </div>
            <hr className='hr' />
            <div className='row fw-bold fs-5'>
              <div className='col-6'>
                Total potential earnings
              </div>
              <div className='col-6 text-end'>
                {commify(toBN(listingForm.price.replaceAll(',', '')).sub(toBN(listingForm.price.replaceAll(',', '')).mul('1').div(PERCENTAGE)))} VND
              </div>
            </div>
          </div>

          <div className='py-2'>
            <ButtonSubmit
              buttonState={buttonState}
              resetState={resetState}
              title='Complete listing'
            />
          </div>
        </form>
        <div className='col col-12 col-md-6 p-4'>
          <div className='card shadow w-25 rounded-3' style={{ position: 'fixed', minWidth: '250px', maxWidth: '560px' }}>
            <div
              className="h-100"
              style={{
                backgroundImage: `url("${toImgUrl(item.thumbnail)}")`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
              }}
            >
              <div style={{
                position: 'absolute',
                zIndex: 1,
                top: 13,
                left: 13,
              }}>
                <ButtonImg
                  imgUrl={toImgUrl(item.from_collection.thumbnail)}
                  title={item.from_collection.name}
                  tooltip={item.from_collection.name + ' Collection'}
                  className='bg-light-50 cursor-no-click'
                />
              </div>

              <img
                src={toImgUrl(item.thumbnail)}
                className="w-100"
                draggable="false"
                style={{
                  backdropFilter: "blur(4px) brightness(90%)",
                  objectFit: 'contain',
                  height: '250px',
                  borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
                }}
                alt={item.name}
              />
            </div>
            <div className="card-body">
              <h5 className="card-title text-nowrap overflow-hidden">{item.name}</h5>
              <h6 className="card-subtitle text-muted mb-2 text-nowrap overflow-hidden">{item.owner.name}</h6>
              <p className="card-text">
                {(listingForm.price)
                  ? ((listingForm.price) + ' VND')
                  : 'Not for sale'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Listing }
