import { useState } from 'react'
import { usePageTitle } from '../../hooks'
import { ButtonSubmit } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { useEth } from '../../contexts'
import { constants } from 'ethers'
import { API_BASE_URI, BUTTON_STATE } from '../../utils'
import { createCollection } from '../../api'


function CreateCollection({ pageTitle }) {
  usePageTitle(pageTitle)
  const eth = useEth()

  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
  const [picture, setPicture] = useState()
  const [collectionFormData, setNftFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    external_url: '',
  })

  const handleInputChange = event => {
    const target = event.target
    let value = target.value
    const name = target.name
    if (name === 'is_phygital') value = !collectionFormData.is_phygital
    setNftFormData({ ...collectionFormData, [name]: value })
  }

  const getFileInfo = event => {
    if (event.target.files[0]
      && (event.target.files[0].type === 'image/jpeg'
        || event.target.files[0].type === 'image/jpg'
        || event.target.files[0].type === 'image/png')
    ) return setPicture([...event.target.files])

    else {
      setPicture()
      document.getElementById('picture').value = null
      window.scroll(0, document.getElementById('picture'))
    }
  }

  const resetState = () => setButtonState(BUTTON_STATE.ENABLE)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    const { currentTarget } = event
    const collectionAddress = await eth.CollectionFactoryContract.callStatic.createCollection(
      eth.account._id.toLowerCase(),
      collectionFormData.name,
      collectionFormData.symbol,
      API_BASE_URI,
    )

    const formData = new FormData()
    formData.append('collection_address', collectionAddress.toLowerCase())
    formData.append('creator_address', eth.account._id.toLowerCase())
    formData.append('name', collectionFormData.name)
    formData.append('symbol', collectionFormData.symbol)
    formData.append('description', collectionFormData.description)
    formData.append('external_url', collectionFormData.external_url)
    formData.append('file', currentTarget.picture.files[0])

    try {
      const response = await createCollection(formData)
      if (response.data) {
        await eth.CollectionFactoryContract.createCollection(
          eth.account._id.toLowerCase(),
          collectionFormData.name,
          collectionFormData.symbol,
          API_BASE_URI,
        )
        setButtonState(BUTTON_STATE.DONE)
      }
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.REJECTED)
    }
  }

  return (
    <div className='container py-4'>
      <h1 className='fw-bold h1'>Create a Collection</h1>
      <hr className='hr' />
      <div className='row'>
        <div className='col col-12 col-md-6'>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='picture' className='fw-bold'>
                Picture <span className='text-danger'>*</span>
              </label>
              <br />
              <small className='text-muted'>
                File types supported: PNG, JPG, JPEG. Max size: 10MB
              </small>
              <input
                type='file'
                name='picture'
                id='picture'
                className='form-control'
                onChange={getFileInfo}
                accept='image/png, image/jpg, image/jpeg'
                required
              />
            </div>

            <div className='form-group my-3'>
              <label htmlFor='name' className='fw-bold'>
                Name <span className='text-danger'>*</span>
              </label>
              <br />
              <small className='text-muted'>
                Your collection name.
              </small>
              <input
                name='name'
                id='name'
                value={collectionFormData.name}
                onChange={handleInputChange}
                type='text'
                className='form-control'
                placeholder='Finentic Shared NFT'
                maxLength='32'
                required
              />
            </div>

            <div className='form-group my-3'>
              <label htmlFor='symbol' className='fw-bold'>
                Symbol <span className='text-danger'>*</span>
              </label>
              <br />
              <small className='text-muted'>
                Your collection symbol.
              </small>
              <input
                name='symbol'
                id='symbol'
                value={collectionFormData.symbol}
                onChange={handleInputChange}
                type='text'
                className='form-control'
                placeholder='FxNFT'
                maxLength='32'
                required
              />
            </div>

            <div className='form-group my-3'>
              <label htmlFor='description' className='fw-bold'>Description:</label>
              <br />
              <small className='text-muted'>
                The description will be included on the collection's detail page underneath its image.
              </small>
              <textarea
                name='description'
                id='description'
                rows='3'
                maxLength='2048'
                onChange={handleInputChange}
                value={collectionFormData.description}
                className='form-control'
                placeholder='Provide a detailed description of your collection.'
              />
            </div>

            <div className='form-group my-3'>
              <label htmlFor='external_url' className='fw-bold'>External URL</label>
              <br />
              <small className='text-muted'>
                Include a link to this URL on this collection's detail page, so that users can click to learn more about it.
                You are welcome to link to your own webpage with more details.
              </small>
              <input
                name='external_url'
                id='external_url'
                maxLength='128'
                value={collectionFormData.external_url}
                onChange={handleInputChange}
                type='text'
                className='form-control'
                placeholder='https://yoursite.io/items/0x123'
              />
            </div>

            <div className='my-3 fw-bold fst-italic text-danger'>
              <FontAwesomeIcon icon={faExclamationTriangle} /> Freeze metadata:
              <span className='fw-normal text-dark'>
                { } Freezing metadata will permanently freeze all required fields of this collection content and store that in blockchain.
              </span>
            </div>
            {
              (eth.account?._id === constants.AddressZero)
                ? <ButtonSubmit buttonState={BUTTON_STATE.DISABLE} resetState={resetState} title='Connect' />
                : <ButtonSubmit buttonState={buttonState} resetState={resetState} title='Create' />
            }
          </form >
        </div>

        <div className='col col-12 col-md-6'>

        </div>
      </div>
    </div >
  )
}

export { CreateCollection }
