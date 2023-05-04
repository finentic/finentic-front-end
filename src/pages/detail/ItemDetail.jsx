import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ButtonSubmit, ImgBgBlur, ModalImg } from '../../components';
import { usePageTitle } from '../../hooks';
import { getItemById } from '../../api';
import { BUTTON_STATE, MARKETPLACE_ADDRESS, SHARED_ADDRESS, VIETNAMESE_DONG_ADDRESS, toImgUrl } from '../../utils'
import { constants } from 'ethers';
import { useEth } from '../../contexts';
import { commify, formatUnits, parseUnits } from 'ethers/lib/utils';
import About from './About';
import CardInfo from './CardInfo';
import { Accordion, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChain, faIdCard, faList, faTags, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import ItemInfo from './ItemInfo';
import { ITEM_STATE } from '../../utils/constants/states';

const formatPrice = (price) => commify(Number(formatUnits(price, 'ether')))

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
  const navigate = useNavigate()

  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
  const [isShowModalItemPicture, setIsShowModalItemPicture] = useState(false)
  const [price, setPrice] = useState(item.price || '0')

  const resetState = () => setButtonState(BUTTON_STATE.ENABLE)

  const handleSubmit = async event => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    const isApproved = await eth.SharedContract.getApproved(item._id.substring(43))
    if (!isApproved) await eth.SharedContract.approve(
      MARKETPLACE_ADDRESS,
      item._id.substring(43),
    ).then(() => setButtonState(BUTTON_STATE.ENABLE)).catch(() => setButtonState(BUTTON_STATE.REJECTED))

    await eth.MarketplaceContract.listForBuyNow(
      SHARED_ADDRESS,
      item._id.substring(43),
      item.is_phygital,
      VIETNAMESE_DONG_ADDRESS,
      parseUnits(price, 'ether'),
    ).then(() => setButtonState(BUTTON_STATE.DONE)).catch(() => setButtonState(BUTTON_STATE.REJECTED))
  }

  const handleBuyNow = async event => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    const allowance = await eth.VietnameseDong.allowance(eth.account._id, eth.MarketplaceContract.address)
    console.log('allowance', allowance);
    console.log('price', parseUnits(price, 0));
    if (allowance.lt(parseUnits(price, 0))) await eth.VietnameseDong.approve(
      MARKETPLACE_ADDRESS,
      constants.MaxUint256,
    ).then(() => setButtonState(BUTTON_STATE.DONE)).catch(() => setButtonState(BUTTON_STATE.REJECTED))
    await eth.MarketplaceContract.buyNow(
      SHARED_ADDRESS,
      item._id.substring(43),
    ).then(() => setButtonState(BUTTON_STATE.DONE)).catch(() => setButtonState(BUTTON_STATE.REJECTED))
  }

  return (
    <div className='container pt-3'>
      <div className='text-end'>
        <div className='d-inline-flex'>
          <Button
            variant='outline-secondary'
            className='me-3 fs-6 fw-bold'
            size='lg'
          >
            Edit item
          </Button>
          <Button
            className='fs-6 fw-bold'
            size='lg'
            onClick={() => navigate(`/item/${item._id}/listing`)}
          >
            List for sale
          </Button>
        </div>
      </div>
      <hr className="hr" />

      <div className='row row-cols-2'>
        <div className='col col-12 col-md-6'>

          <div className='py-3'>
            <div className={`rounded-3 shadow border h-100 w-100`}>
              <ImgBgBlur
                alt={item.name}
                fileUri={item.pictures[0].file_uri}
                onClick={() => setIsShowModalItemPicture(true)}
              />
            </div>
          </div>
          <ModalImg
            show={isShowModalItemPicture}
            onHide={() => setIsShowModalItemPicture(false)}
            name={item.name}
            imgSrc={toImgUrl(item.pictures[0].file_uri)}
          />

          <div className='py-3'>
            <div className='rounded-3 shadow h-100 w-100'>
              <Accordion defaultActiveKey={['Description']} alwaysOpen>
                <Accordion.Item eventKey='Description'>
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faList} />
                    <span className='fw-bold ms-2'>
                      Description
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {item.description.split('\n').map(str => <p key={str}>{str}</p>)}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey={'About ' + item.ownership_history[0].owner.name}>
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faIdCard} />
                    <span className='fw-bold ms-2'>
                      {'About ' + item.ownership_history[0].owner.name}
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {item.ownership_history[0].owner.name}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey='Details'>
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faChain} />
                    <span className='fw-bold ms-2'>
                      Details
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <About item={item} />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>

        <div className='col col-12 col-md-6'>
          <ItemInfo
            name={item.name}
            from_collection={item.from_collection}
            owner={item.owner}
            ownership_history={item.ownership_history}
          />

          {(item.state === ITEM_STATE.LISTING) && (
            <CardInfo>
              <form onSubmit={handleBuyNow} hidden={eth.account?._id.toLowerCase() === item.owner._id.toLowerCase()}>
                <div className='row my-3'>
                  <div className='col'>
                    <div className='form-group'>
                      <label htmlFor='price' className='fw-bold'>
                        Price:
                      </label> {formatPrice(price)} VND
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
            </CardInfo>
          )}

          <CardInfo icon={faTags} title='Price History' defaultActive>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </CardInfo>

          <CardInfo icon={faUserFriends} title='Owner History' defaultActive>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </CardInfo>
        </div>
      </div>
    </div>
  )
}

export { ItemDetail }