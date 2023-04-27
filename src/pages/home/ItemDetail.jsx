import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ModalItemPicture from './ModalItemPicture';
import { ButtonSubmit, ToastAutoHide } from '../../components';
import { usePageTitle } from '../../hooks';
import { getItemById } from '../../api';
import { API_BASE_URI, BUTTON_STATE, MARKETPLACE_ADDRESS, SHARED_ADDRESS, VIETNAMESE_DONG_ADDRESS } from '../../utils'
import { constants } from 'ethers';
import { useEth } from '../../contexts';
import { formatEther, parseEther } from 'ethers/lib/utils';

function ItemDetail(props) {
  const { pageTitle } = props
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
  return (<Detail item={itemDetail} key={itemDetail._id} />)
}

function Detail({ item }) {
  const { eth } = useEth()
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
  const [modalItemPictureShow, setModalItemPictureShow] = useState(false)
  const [price, setPrice] = useState(item.price ? formatEther(item.price) : '0')

  const resetState = () => setButtonState(BUTTON_STATE.ENABLE)

  const handleSubmit = async event => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    const isAppoved = await eth.SharedContract.getApproved(item._id.substring(43))
    if (!isAppoved) await eth.SharedContract.approve(
      MARKETPLACE_ADDRESS,
      item._id.substring(43),
    )
    await eth.MarketplaceContract.listForBuyNow(
      SHARED_ADDRESS,
      item._id.substring(43),
      item.is_phygital,
      VIETNAMESE_DONG_ADDRESS,
      parseEther(price),
    )
    setButtonState(BUTTON_STATE.DONE)
  }

  const handleBuyNow = async event => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    const allowance = await eth.VietnameseDong.allowance(eth.account._id, eth.MarketplaceContract.address)
    if (allowance.lte(parseEther(price))) await eth.VietnameseDong.approve(
      MARKETPLACE_ADDRESS,
      constants.MaxUint256,
    )
    await eth.MarketplaceContract.buyNow(
      SHARED_ADDRESS,
      item._id.substring(43),
    )
    setButtonState(BUTTON_STATE.DONE)
  }

  console.log(`${API_BASE_URI}/${item.pictures[0].file_uri}`)
  return (
    <div className='px-5 pt-5'>
      <div className='row'>
        <div className='col-12 col-md-6 col-lg-4 ps-0 pe-0 pe-md-3 mb-3'>
          <img
            src={`${API_BASE_URI}/${item.pictures[0].file_uri}`}
            alt={item.name}
            className="bg-light rounded-3 h-100"
            style={{ objectFit: 'contain', maxHeight: '350px', width: '100%' }}
            onClick={() => setModalItemPictureShow(true)}
          />
        </div>
        <ModalItemPicture
          show={modalItemPictureShow}
          onHide={() => setModalItemPictureShow(false)}
          src={`${API_BASE_URI}/${item.pictures[0].file_uri}`}
          alt={item.name}
        />
        <div
          className='col-12 col-md-6 col-lg-8 bg-light rounded-3 py-3 mb-3 p-4 h-100 text-center text-md-start border border-2'
          style={{ minHeight: '350px' }}
        >
          Owned by: { }
          <span className='text-secondary'>
            <ToastAutoHide
              message='Copy'
              feedback='Copied!'
              title={item.owner.name}
              content={item.owner._id} />
          </span>
          <h3 className="pb-3 col-12 mt-2">{item.name}</h3>
          <div className="form-check form-switch pb-3">
            <input className="form-check-input" type="checkbox" id="is_phygital" name="is_phygital" defaultChecked={item.is_phygital} disabled />
            <label className="form-check-label" htmlFor="is_phygital">This item is phygital NFT</label>
          </div>
          <form onSubmit={handleSubmit} hidden={eth.account?._id.toLowerCase() !== item.owner._id.toLowerCase()}>
            <div className='row my-3'>
              <div className='col'>
                <div className='form-group'>
                  <label htmlFor='price' className='fw-bold'>Price:</label>
                  <br />
                  <small className='text-muted'>You can change item price anytime.</small>
                  <input
                    name='price'
                    id='price'
                    onChange={(event) => setPrice(event.target.value)}
                    type='number'
                    className='form-control'
                    value={price}
                    min={0}
                    required
                  />
                </div>
              </div>
              <div className='col-4'>
                <div className='form-group'>
                  <label htmlFor='unit' className='fw-bold'>Unit:</label>
                  <br />
                  <small className='text-muted'>Price in </small>
                  <select className='form-control' name='unit' id='unit'>
                    <option>Vietnamese Dong (VND)</option>
                    <option disabled>USD Coin (USDC)</option>
                    <option disabled>Ether (ETH)</option>
                  </select>
                </div>
              </div>
            </div>
            {
              (eth.account._id === constants.AddressZero)
                ? <ButtonSubmit buttonState={BUTTON_STATE.DISABLE} resetState={resetState} title='Connect' />
                : <ButtonSubmit buttonState={buttonState} resetState={resetState} title='List for buy now' />
            }
          </form>
          <form onSubmit={handleBuyNow} hidden={eth.account?._id.toLowerCase() === item.owner._id.toLowerCase()}>
            <div className='row my-3'>
              <div className='col'>
                <div className='form-group'>
                  {
                    (item.price)
                      ? <div><label htmlFor='price' className='fw-bold'>Price: </label> {item.price} VND </div>
                      : <label htmlFor='price' className='fw-bold'>Not for sell </label>
                  }
                </div>
              </div>
              <div className='col-4'>
                <div className='form-group'>
                  <label htmlFor='unit' className='fw-bold'>Unit:</label>
                  <br />
                  <small className='text-muted'>Price in </small>
                  <select className='form-control' name='unit' id='unit'>
                    <option>Vietnamese Dong (VND)</option>
                    <option disabled>USD Coin (USDC)</option>
                    <option disabled>Ether (ETH)</option>
                  </select>
                </div>
              </div>
            </div>
            {
              (!item.price)
                ? <ButtonSubmit buttonState={BUTTON_STATE.DISABLE} resetState={resetState} title='Not for sale' />
                : <ButtonSubmit buttonState={buttonState} resetState={resetState} title='Buy Now' />
            }
          </form>
        </div>
      </div>

      <div className='row'>
        <div className='col-12 col-md-6 col-lg-4 ps-0 pe-0 pe-md-3 mb-3 ' >
          <div className='bg-light p-3 h-100' >
            <h5 className='text-center' >About</h5>
            <p className=' px-4 text-secondary' style={{ overflowY: 'scroll', height: '150px' }} >
              <strong className='text-dark'>From collection:</strong>
              <ToastAutoHide
                message='Copy'
                feedback='Copied!'
                title={item.from_collection.name}
                content={item.from_collection._id}
              /><br />
              <strong className='text-dark'>Create at: </strong> {(item.createdAt).substring(0, 10)}<br />
              <strong className='text-dark'>External URL:</strong><br />
              <a
                className='overflow-hidden text-wrap text-break text-secondary'
                href={item.external_url}
              >
                {item.external_url}
              </a><br />

              <strong className='text-dark'>Raw data url:</strong><br />
              <a
                className='overflow-hidden text-wrap text-break text-secondary'
                href={`${API_BASE_URI}/items/raw/${item._id}`}
              >
                {`${API_BASE_URI}/items/raw/${item._id}`}
              </a><br />
              <strong className='text-dark'>Raw data hash:</strong><br />
              <span className='text-secondary'>
                <ToastAutoHide
                  message='Copy'
                  feedback='Copied!'
                  title={item.hashed_metadata}
                  content={item.hashed_metadata} />
              </span>
            </p>
          </div>
        </div>
        <div className='col-12 col-md-6 col-lg-8 bg-light rounded-3 py-3 mb-3'>
          <h5 className='text-center'>Description</h5>
          <div className='text-center px-4 text-wrap' style={{ overflowY: 'scroll', height: '150px' }}>
            {item.description.split('\n').map(str => <p key={str}>{str}</p>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail