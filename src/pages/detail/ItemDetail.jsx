import {
  BUTTON_STATE,
  MARKETPLACE_ADDRESS,
  SHARED_ADDRESS,
  ITEM_STATE,
  LISTING_STATE,
  getTokenIdFromItemId,
  timestampToDate,
  formatPrice,
  toBN,
  toImgUrl,
} from '../../utils'
import {
  faBriefcaseClock,
  faChain,
  faClockRotateLeft,
  faIdCard,
  faList,
  faTag,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { commify, parseUnits } from 'ethers/lib/utils';
import { Accordion, Button, Dropdown, DropdownButton, Form, InputGroup } from 'react-bootstrap';
import { useEth } from '../../contexts';
import { usePageTitle } from '../../hooks';
import { getItemById } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonImg, ButtonSubmit, ImgBgBlur, ModalImg } from '../../components';
import About from './About';
import CardInfo from './CardInfo';
import ItemInfo from './ItemInfo';

const BUTTON_TITLE = {
  'BUY_NOW': 'Buy now',
  'START_SOON': 'Preparing',
  'ACTIVE': 'Place bid',
  'ENDED': 'Ended',
}

const LISTING_TITLE = {
  'BUY_NOW': 'Buy now',
  'START_SOON': 'Auction will start soon',
  'ACTIVE': 'Auction active',
  'ENDED': 'Auction has ended',
}


function ItemDetail({ pageTitle }) {
  const { eth } = useEth()
  const { itemId } = useParams()
  usePageTitle(pageTitle)
  const [itemDetail, setItemDetail] = useState(false)

  useEffect(() => {
    const getItemList = async () => {
      try {
        const item = await getItemById(itemId)
        console.log(item)
        setItemDetail(item.data)
      } catch (error) { console.error(error) }
    }
    getItemList()
    return () => setItemDetail(false)
  }, [itemId])
  if (!itemDetail || !eth.account) return null
  return (<Detail item={itemDetail} key={itemDetail._id} />)
}

function Detail({ item }) {
  const { eth } = useEth()
  const navigate = useNavigate()
  usePageTitle(item.name)
  const isOwner = (item.owner._id.toLowerCase() === eth.account._id.toLowerCase())
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
  const [isShowModalItemPicture, setIsShowModalItemPicture] = useState(false)
  const now = new Date().getTime()
  const startTime = Number(item.start_time + '000')
  const endTime = Number(item.end_time + '000')

  const getListingState = () => {
    if (!item.start_time) return LISTING_STATE.BUY_NOW
    if (now < startTime) return LISTING_STATE.START_SOON
    if (now > startTime && now < endTime) return LISTING_STATE.ACTIVE
    if (now > endTime) return LISTING_STATE.ENDED
  }

  const resetState = () => setButtonState(BUTTON_STATE.ENABLE)

  const [auctionForm, setAuctionForm] = useState({
    price: formatPrice(item.price || '0'),
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
    setAuctionForm({ ...auctionForm, [name]: value })
  }

  const handlePlaceBid = async event => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    try {
      const bid = parseUnits(auctionForm.price.replaceAll(',', ''), '18')
      const isEnoughAllowance = await eth.VietnameseDong.allowance(eth.account._id, MARKETPLACE_ADDRESS)
      if (isEnoughAllowance.lt(bid)) {
        await eth.VietnameseDong.approve(MARKETPLACE_ADDRESS, bid)
        eth.VietnameseDong.on('Approval', async (owner) => (owner.toLowerCase() === eth.account._id) && setButtonState(BUTTON_STATE.DONE))
      }
      await eth.MarketplaceContract.biddingForAuction(
        SHARED_ADDRESS,
        getTokenIdFromItemId(item._id),
        bid,
      )
      setButtonState(BUTTON_STATE.DONE)
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.REJECTED)
    }
  }

  const handleBuyNow = async event => {
    event.preventDefault()
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    try {
      const price = parseUnits(item.price, '0')
      const isEnoughAllowance = await eth.VietnameseDong.allowance(eth.account._id, MARKETPLACE_ADDRESS)
      if (isEnoughAllowance.lt(price)) {
        await eth.VietnameseDong.approve(MARKETPLACE_ADDRESS, price)
        eth.VietnameseDong.on('Approval', async (owner) => (owner.toLowerCase() === eth.account._id) && setButtonState(BUTTON_STATE.DONE))
      }
      await eth.MarketplaceContract.buyNow(
        SHARED_ADDRESS,
        getTokenIdFromItemId(item._id),
      )
      setButtonState(BUTTON_STATE.DONE)
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.REJECTED)
    }
  }

  return (
    <div className='container pt-3'>
      {(isOwner) && (
        <>
          <div className='text-end'>
            <div className='d-inline-flex'>
              <Button
                variant='outline-secondary'
                className='me-3 fs-6 fw-bold'
                size='lg'
                onClick={() => navigate(`/item/${item._id}/edit`)}
              >
                Edit item
              </Button>
              {(!item.price) && (
                <Button
                  className='fs-6 fw-bold'
                  size='lg'
                  onClick={() => navigate(`/item/${item._id}/listing`)}
                >
                  List for sale
                </Button>
              )}
            </div>
          </div>
          <hr className="hr" />
        </>
      )}

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

                <Accordion.Item eventKey={'About ' + item.creator.name}>
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faIdCard} />
                    <span className='fw-bold ms-2'>
                      {'About ' + item.creator.name}
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {item.creator.bio || <div className='text-center text-secondary fw-bold'>This collection has no description yet.</div>}
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
            is_phygital={item.is_phygital}
            from_collection={item.from_collection}
            owner={item.owner}
            ownership_history={item.ownership_history}
          />

          {(item.state === ITEM_STATE.LISTING) && (
            <CardInfo
              icon={item.start_time ? faBriefcaseClock : faTag}
              title={LISTING_TITLE[getListingState()]}
              defaultActive
            >
              <form onSubmit={(!item.start_time) ? handleBuyNow : handlePlaceBid}>
                <div className='col'>
                  <p>
                    {item.start_time ? 'Top bid' : 'Price'}: <br />
                    <span className='fs-4 fw-bold'>
                      {(formatPrice(item.price) + ' VND')}
                    </span>
                  </p>
                </div>

                <div hidden={isOwner}>
                  {(getListingState() === LISTING_STATE.ACTIVE) && (
                    <div className='form-group py-3'>
                      <span className='fw-bold fs-5'>
                        Place a bid
                      </span>
                      <br />
                      <small className='text-muted'>
                        Require higher than top bid.
                      </small>
                      <InputGroup className="pb-2">
                        <Form.Control
                          id='price'
                          name='price'
                          size='lg'
                          type='text'
                          value={auctionForm.price}
                          onChange={handleInputChange}
                          disabled={isOwner}
                          readOnly={isOwner}
                        />
                        <DropdownButton
                          variant="outline-secondary"
                          title="VND"
                          id="currency"
                          align="end"
                          disabled
                        >
                          <Dropdown.Item href="#">VND - Vietnamese Dong</Dropdown.Item>
                        </DropdownButton>
                      </InputGroup>
                    </div>
                  )}
                  <ButtonSubmit
                    buttonState={
                      (getListingState() === LISTING_STATE.BUY_NOW || (
                        getListingState() === LISTING_STATE.ACTIVE && (
                          toBN(formatPrice(item.price).replaceAll(',', ''))
                            .lt(toBN(auctionForm.price.replaceAll(',', ''))))))
                        ? buttonState
                        : BUTTON_STATE.DISABLE
                    }
                    resetState={resetState}
                    title={BUTTON_TITLE[getListingState()]}
                  />
                </div>
              </form>

              {(item.start_time && (
                <>
                  <hr className='hr' />
                  <div className='row text-center text-secondary fw-bold'>
                    <div className='col col-12 col-md-6'>
                      Start: {timestampToDate(item.start_time)}
                    </div>
                    <div className='col col-12 col-md-6'>
                      End: {timestampToDate(item.end_time)}
                    </div>
                  </div>
                </>
              ))}
            </CardInfo>
          )}

          <CardInfo icon={faClockRotateLeft} title='Price History' defaultActive>
            <table className="table" hidden={(!item.price_history.length)}>
              <thead>
                <tr>
                  <th scope="col">Offerer</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {item.price_history.map(ownership => (
                  <tr key={ownership.timestamp}>
                    <td>
                      <ButtonImg
                        imgUrl={toImgUrl(ownership.account.thumbnail)}
                        title={ownership.account.name}
                        tooltip={'Account of ' + ownership.account.name}
                        onClick={() => navigate(`/account/${ownership.account._id}`)}
                      />
                    </td>
                    <td>
                      {formatPrice(ownership.amount)} VND
                    </td>
                    <td
                      className='cursor-pointer'
                      onClick={() => window.open('https://testnet.snowtrace.io/tx/' + ownership.tx_hash)}
                    >
                      {timestampToDate(ownership.timestamp)}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            <div className='fw-bold text-center text-secondary' hidden={(item.price_history.length)}>
              No events have occurred yet
            </div>
          </CardInfo>

          <CardInfo icon={faUserFriends} title='Ownership History' defaultActive>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Owner</th>
                  <th scope="col">Timestamp</th>
                  <th scope="col">Txn Hash</th>
                </tr>
              </thead>
              <tbody>
                {item.ownership_history.map(ownership => (
                  <tr key={ownership.timestamp}>
                    <td>
                      <ButtonImg
                        imgUrl={toImgUrl(ownership.account.thumbnail)}
                        title={ownership.account.name}
                        tooltip={'Account of ' + ownership.account.name}
                        onClick={() => navigate(`/account/${ownership.account._id}`)}
                      />
                    </td>
                    <td>
                      {timestampToDate(ownership.timestamp)}
                    </td>
                    <td
                      className='text-decoration-underline cursor-pointer'
                      onClick={() => window.open('https://testnet.snowtrace.io/tx/' + ownership.tx_hash)}
                    >
                      {ownership.tx_hash.substr(0, 3) + '...' + ownership.tx_hash.substr(63, 66)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardInfo>
        </div>
      </div>
    </div >
  )
}

export { ItemDetail }