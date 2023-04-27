import { useState } from 'react'
import { usePageTitle } from '../../hooks'
import { ButtonSubmit } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { useEth } from '../../contexts'
import { constants } from 'ethers'
import { BUTTON_STATE, MARKETPLACE_ADDRESS } from '../../utils'
import { createItem } from '../../api'


function Create(props) {
  const { pageTitle } = props
  usePageTitle(pageTitle)
  const { eth } = useEth()

  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
  const [nftFormData, setNftFormData] = useState({
    name: '',
    is_phygital: false,
    pictures: undefined,
    description: '',
    external_url: '',
  })

  const handleInputChange = event => {
    const target = event.target
    const value = target.value
    const name = target.name
    setNftFormData({ ...nftFormData, [name]: value })
  }

  const getFileInfo = event => {
    if (event.target.files[0]
      && (event.target.files[0].type === 'image/jpeg'
        || event.target.files[0].type === 'image/jpg'
        || event.target.files[0].type === 'image/png')
    ) setNftFormData({ ...nftFormData, pictures: event.target.files })
    else {
      setNftFormData({ ...nftFormData, pictures: undefined })
      document.getElementById('pictures').value = null
      window.scroll(0, document.getElementById('pictures'))
    }
  }

  const resetState = () => setButtonState(BUTTON_STATE.ENABLE)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    const { currentTarget } = event;
    const currentTokenId = await eth.SharedContract.currentTokenId()
    const formData = new FormData();
    formData.append('token_id', currentTokenId.toString());
    formData.append('owner_address', eth.account._id.toLowerCase());
    formData.append('name', nftFormData.name);
    formData.append('from_collection_address', eth.SharedContract.address);
    formData.append('description', nftFormData.description);
    formData.append('external_url', nftFormData.external_url);
    formData.append('is_phygital', !!nftFormData.is_phygital);
    for (const element of currentTarget.pictures.files) {
      formData.append('files', element);
    }

    const response = await createItem(formData);
    console.log(response.data.hashed_metadata);
    await eth.SharedContract.mintAndApprove(eth.account._id, MARKETPLACE_ADDRESS, response.data.hashed_metadata)
    setButtonState(BUTTON_STATE.DONE)
  }

  return (
    <div className='px-5 pt-5'>
      <form onSubmit={handleSubmit}>
        <h2>Create Shared NFT</h2>

        <div className='form-group my-3'>
          <div className='text-muted mb-2'>
            <span className='text-danger'>*</span> Required fields
          </div>
          <label htmlFor='pictures' className='fw-bold'>
            Picture <span className='text-danger'>*</span>
          </label>
          <br />
          <small className='text-muted'>
            File types supported: PNG, JPG, JPEG. Max size: 10MB
          </small>
          <input
            type='file'
            name='pictures'
            id='pictures'
            className='form-control'
            onChange={getFileInfo}
            accept='image/png, image/jpg, image/jpeg'
            required
            multiple
          />
        </div>

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
            type='text'
            className='form-control'
            placeholder='Item name'
            maxLength='128'
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
            value={nftFormData.external_url}
            onChange={handleInputChange}
            type='text'
            className='form-control'
            placeholder='https://yoursite.io/item/123'
          />
        </div>

        <div className='form-group my-3'>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="is_phygital" name="is_phygital" onChange={handleInputChange} />
            <label className="form-check-label" htmlFor="is_phygital">This item is phygital NFT</label>
          </div>
        </div>

        <div className='my-3 fw-bold fst-italic text-danger'>
          <FontAwesomeIcon icon={faExclamationTriangle} /> Freeze metadata:
          <span className='fw-normal text-dark'>
            Your metadata will not lock and store all of this item's content in decentralized file storage.
          </span>
        </div>
        {
          (eth.account?._id === constants.AddressZero)
            ? <ButtonSubmit buttonState={BUTTON_STATE.DISABLE} resetState={resetState} title='Connect' />
            : <ButtonSubmit buttonState={buttonState} resetState={resetState} title='Create' />
        }
      </form>
    </div>
  )
}

export { Create }
