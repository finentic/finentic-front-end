import {
  BUTTON_STATE,
  ITEM_STATE,
  toImgUrl,
  toTokenAddress,
  toTokenId,
} from '../../utils'
import {
  faReceipt,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Carousel,
} from 'react-bootstrap';
import { ButtonSubmit, ImgBgBlur, ModalImg } from '../../components';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEth } from '../../contexts';
import { usePageTitle } from '../../hooks';
import { getItemById } from '../../api';
import CardInfo from './CardInfo';
import ItemInfo from './ItemInfo';
import Trading from './Trading';
import OwnershipHistory from './OwnershipHistory';
import PriceHistory from './PriceHistory';
import ItemDescription from './ItemDescription';

function ItemDetail({ pageTitle }) {
  const eth = useEth()
  const { itemId } = useParams()
  const navigate = useNavigate()
  usePageTitle(pageTitle)
  const [itemDetail, setItemDetail] = useState({})

  useEffect(() => {
    if (eth.MarketplaceContract && (itemId !== itemDetail._id)) {
      const getItemDetail = async () => {
        const item = await getItemById(itemId)
        if (item.data === null) navigate('/404')
        setItemDetail({ ...itemDetail, ...item.data })
      }
      getItemDetail()
      eth.MarketplaceContract.on(
        'BiddingForAuction',
        async (nftContract, tokenId) => (
          nftContract.toLowerCase() === toTokenAddress(itemId).toLowerCase() &&
          tokenId.toString() === toTokenId(itemId)
        ) && getItemDetail()
      )
      eth.MarketplaceContract.on(
        'Invoice',
        async (_buyer, _seller, nftContract, tokenId) => (
          nftContract.toLowerCase() === toTokenAddress(itemId).toLowerCase() &&
          tokenId.toString() === toTokenId(itemId)
        ) && getItemDetail()
      )
      eth.MarketplaceContract.on(
        'RemoveItemForBuyNow',
        async (nftContract, tokenId) => (
          nftContract.toLowerCase() === toTokenAddress(itemId).toLowerCase() &&
          tokenId.toString() === toTokenId(itemId)
        ) && getItemDetail()
      )
      eth.MarketplaceContract.on(
        'RemoveItemForAuction',
        async (nftContract, tokenId) => (
          nftContract.toLowerCase() === toTokenAddress(itemId).toLowerCase() &&
          tokenId.toString() === toTokenId(itemId)
        ) && getItemDetail()
      )
      return () => eth.MarketplaceContract.removeAllListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eth.MarketplaceContract, itemId])

  if (!itemDetail._id || !eth.account) return null
  return (<Detail item={itemDetail} key={itemDetail._id} />)
}

function Detail({ item }) {
  const eth = useEth()
  const navigate = useNavigate()
  usePageTitle(item.name)
  const isOwner = (item.owner._id.toLowerCase() === eth.account._id.toLowerCase())
  const [modalItemPictureUrl, setModalItemPictureUrl] = useState(undefined)
  const [isShowModalItemPicture, setIsShowModalItemPicture] = useState(false)
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)

  const setModalItemPicture = (url) => {
    setModalItemPictureUrl(url)
    setIsShowModalItemPicture(!isShowModalItemPicture)
  }

  const resetState = () => {
    setButtonState(BUTTON_STATE.ENABLE)
  }

  const handleDelisting = async event => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    try {
      if (item.start_time) {
        await eth.MarketplaceContract.cancelListItemForAuction(
          toTokenAddress(item._id),
          toTokenId(item._id),
        )
      } else {
        await eth.MarketplaceContract.cancelListItemForBuyNow(
          toTokenAddress(item._id),
          toTokenId(item._id),
        )
      }
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
              {(item.state === ITEM_STATE.CREATED) && (
                <Button
                  className='fs-6 fw-bold'
                  size='lg'
                  onClick={() => navigate(`/item/${item._id}/listing`)}
                >
                  List for sale
                </Button>
              )}
              {(item.state === ITEM_STATE.LISTING) && (
                <ButtonSubmit
                  buttonState={buttonState}
                  resetState={resetState}
                  title='Delisting'
                  className='btn-outline-primary btn-lg fs-6 fw-bold'
                  onClick={handleDelisting}
                />
              )}
            </div>
          </div>
          <hr className="hr" />
        </>
      )}

      <div className='row row-cols-2'>
        <div className='col col-12 col-md-6'>
          <div className='py-2'>
            <div className='rounded-3 border h-100 w-100' >
              {(item.pictures.length > 1)
                ? <Carousel fade interval={null} pause={'hover'}>
                  {item.pictures.map(
                    (picture) => picture &&
                      <Carousel.Item key={picture.raw_base64_hashed}>
                        <ImgBgBlur
                          alt={item.name}
                          fileUri={picture.file_uri}
                          onClick={() => setModalItemPicture(picture.file_uri)}
                        />
                      </Carousel.Item>
                  )}
                </Carousel>
                : <ImgBgBlur
                  alt={item.name}
                  fileUri={item.pictures[0].file_uri}
                  onClick={() => setModalItemPicture(item.pictures[0].file_uri)}
                />
              }
            </div>
          </div>

          <ModalImg
            show={isShowModalItemPicture}
            onHide={() => setModalItemPicture(item.pictures[0].file_uri)}
            onOpenNewTab={() => window.open(toImgUrl(modalItemPictureUrl))}
            name={item.name}
            imgSrc={toImgUrl(modalItemPictureUrl)}
          />

          <div className='py-2 d-none d-md-block'>
            <ItemDescription item={item} />
          </div>
        </div>

        <div className='col col-12 col-md-6'>
          <ItemInfo
            name={item.name}
            from_collection={item.from_collection}
            owner={item.owner}
          />

          <div className='py-2'>
            <Trading item={item} isOwner={isOwner} />
          </div>

          <div className='py-2 d-block d-md-none'>
            <ItemDescription item={item} />
          </div>

          <CardInfo icon={faReceipt} title='Price History' defaultActive>
            <PriceHistory
              price_history={item.price_history}
              navigate={navigate}
            />
          </CardInfo>

          <CardInfo icon={faUserFriends} title='Ownership History' defaultActive>
            <OwnershipHistory
              ownership_history={item.ownership_history}
              navigate={navigate}
            />
          </CardInfo>
        </div>
      </div>
    </div >
  )
}

export { ItemDetail }