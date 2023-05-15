import {
  ITEM_STATE,
  toImgUrl,
  toTokenId,
} from '../../utils'
import {
  faChain,
  faIdCard,
  faList,
  faReceipt,
  faTable,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import {
  Accordion,
  Button,
  Carousel,
} from 'react-bootstrap';
import { ImgBgBlur, ModalImg } from '../../components';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEth } from '../../contexts';
import { usePageTitle } from '../../hooks';
import { getItemById } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import About from './About';
import CardInfo from './CardInfo';
import ItemInfo from './ItemInfo';
import Trading from './Trading';
import OwnershipHistory from './OwnershipHistory';
import PriceHistory from './PriceHistory';

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
        console.log(item.data)
        if (item.data === null) navigate('/404')
        setItemDetail({ ...itemDetail, ...item.data })
      }
      getItemDetail()
      eth.MarketplaceContract.on(
        'BiddingForAuction',
        async (nftContract, tokenId) => (
          nftContract.toLowerCase() === eth.SharedContract.address.toLowerCase() &&
          tokenId.toString() === toTokenId(itemId)
        ) && getItemDetail()
      )
      eth.MarketplaceContract.on(
        'Invoice',
        async (_buyer, _seller, nftContract, tokenId) => (
          nftContract.toLowerCase() === eth.SharedContract.address.toLowerCase() &&
          tokenId.toString() === toTokenId(itemId)
        ) && getItemDetail()
      )
      eth.MarketplaceContract.on(
        'RemoveItemForBuyNow',
        async (nftContract, tokenId) => (
          nftContract.toLowerCase() === eth.SharedContract.address.toLowerCase() &&
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

  const setModalItemPicture = (url) => {
    setModalItemPictureUrl(url)
    setIsShowModalItemPicture(!isShowModalItemPicture)
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
            </div>
          </div>
          <hr className="hr" />
        </>
      )}

      <div className='row row-cols-2'>
        <div className='col col-12 col-md-6'>
          <div className='py-3'>
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

          <div className='py-3'>
            <div className='rounded-3 h-100 w-100' style={{ whiteSpace: 'pre-line' }}>
              <Accordion defaultActiveKey={['Description']} alwaysOpen>
                <Accordion.Item eventKey='Description'>
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faList} />
                    <span className='fw-bold ms-2'>
                      Description
                    </span>
                  </Accordion.Header>
                  <Accordion.Body className='bg-light'>
                    {item.description || <div className='text-center text-secondary fw-bold'>
                      This item has no description yet. {'\n'} Contact the owner about setting it up.
                    </div>}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey='Properties' hidden={(!item.properties.length)}>
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faTable} />
                    <span className='fw-bold ms-2'>
                      Properties
                    </span>
                  </Accordion.Header>
                  <Accordion.Body className='bg-light'>
                    <div className='row py-n3'>
                      {item.properties.map(property => (
                        <div key={property._id} className='col-6 text-center p-2'>
                          <div className='card p-2'>
                            <div className='fw-bold text-secondary text-decoration-uppercase'>
                              {property.name}
                            </div>
                            <div className='fw-bold text-third'>
                              {property.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey={'About ' + item.creator.name}>
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faIdCard} />
                    <span className='fw-bold ms-2'>
                      {'About ' + item.creator.name}
                    </span>
                  </Accordion.Header>
                  <Accordion.Body className='bg-light'>
                    {item.creator.bio || <div className='text-center text-secondary fw-bold'>
                      This creator has no bio yet. {'\n'} Contact the creator about setting it up.
                    </div>}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey='Details'>
                  <Accordion.Header>
                    <FontAwesomeIcon icon={faChain} />
                    <span className='fw-bold ms-2'>
                      Details
                    </span>
                  </Accordion.Header>
                  <Accordion.Body className='bg-light'>
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

          <Trading item={item} isOwner={isOwner}/>

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