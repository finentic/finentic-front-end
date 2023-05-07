import { useEffect, useState } from 'react'
import { usePageTitle } from '../../hooks'
import { ButtonSubmit } from '../../components'
import { useEth } from '../../contexts'
import { BUTTON_STATE } from '../../utils'
import { getItemForUpdate, updateItem } from '../../api'
import { useNavigate, useParams } from 'react-router-dom'


function Edit() {
  const { itemId } = useParams()
  const { eth } = useEth()
  const navigate = useNavigate()
  const [itemDetail, setItemDetail] = useState(false)

  useEffect(() => {
    const getItemList = async () => {
      try {
        const item = await getItemForUpdate(itemId)
        console.log(item)
        setItemDetail(item.data)
      } catch (error) { }
    }
    getItemList()
    return () => setItemDetail(false)
  }, [itemId])

  if (!itemDetail) return null
  const isOwner = (itemDetail.owner._id.toLowerCase() === eth.account._id.toLowerCase())
  if (!isOwner || itemDetail.price) navigate(`/item/${itemDetail._id}`)
  return (<EditItem item={itemDetail} key={itemDetail._id} />)
}

function EditItem({ item }) {
  usePageTitle(`Edit ${item.name}`)
  const navigate = useNavigate()

  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
  const [nftFormData, setNftFormData] = useState({
    name: item.name,
    description: item.description,
    external_url: item.external_url,
  })

  const handleInputChange = event => {
    const target = event.target
    const value = target.value
    const name = target.name
    setNftFormData({ ...nftFormData, [name]: value })
  }

  const resetState = () => setButtonState(BUTTON_STATE.ENABLE)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    try {
      await updateItem({
        item_id: item._id,
        description: nftFormData.description,
        external_url: nftFormData.external_url,
      })
      setButtonState(BUTTON_STATE.DONE)
      navigate(`/item/${item._id}`)
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.REJECTED)
    }
  }

  return (
    <div className='container py-4'>
      <form onSubmit={handleSubmit}>
        <h1 className='fw-bold fs-2'>Edit item</h1>
        <div className='form-group my-3'>
          <label htmlFor='name' className='fw-bold'>
            Name <span className='text-danger'>*</span>
          </label>
          <br />
          <small className='text-muted'>
            Everyone can find your item by this name.
          </small>
          <input
            name='name'
            id='name'
            value={nftFormData.name}
            onChange={handleInputChange}
            readOnly
            disabled
            type='text'
            className='form-control'
            placeholder='Item name'
            maxLength='64'
            required
          />
        </div>
        <div className='form-group my-3'>
          <label htmlFor='description' className='fw-bold'>Description:</label>
          <br />
          <small className='text-muted'>
            The description will be included on the item's detail page underneath its image.
          </small>
          <textarea
            name='description'
            id='description'
            rows='3'
            maxLength='2048'
            onChange={handleInputChange}
            value={nftFormData.description}
            className='form-control'
            placeholder='Provide a detailed description of your item.'
          />
        </div>

        <div className='form-group my-3'>
          <label htmlFor='external_url' className='fw-bold'>External URL</label>
          <br />
          <small className='text-muted'>
            Include a link to this URL on this item's detail page, so that users can click to learn more about it.
            You are welcome to link to your own webpage with more details.
          </small>
          <input
            name='external_url'
            id='external_url'
            maxLength='128'
            value={nftFormData.external_url}
            onChange={handleInputChange}
            type='text'
            className='form-control'
            placeholder='https://yoursite.io/items/0x123'
          />
        </div>
        <ButtonSubmit
          buttonState={buttonState}
          resetState={resetState}
          title='Submit changes'
        />
      </form>
    </div>
  )
}

export { Edit }
