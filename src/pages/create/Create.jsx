import { useEffect, useState } from 'react'
import { usePageTitle } from '../../hooks'
import { ButtonSubmit } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEth } from '../../contexts'
import { constants } from 'ethers'
import { BUTTON_STATE, MARKETPLACE_ADDRESS, SHARED_ADDRESS, collectionContract } from '../../utils'
import { createItem, getAllCollectionOfAccount, getCollection } from '../../api'
import { Table } from 'react-bootstrap'
import CreatePreview from './CreatePreview'


function Create({ pageTitle }) {
  usePageTitle(pageTitle)
  const eth = useEth()

  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE)
  const [properties, setProperties] = useState([])
  const [pictures, setPictures] = useState([])
  const [collections, setCollections] = useState([])
  const [collectionSelected, setCollectionSelected] = useState({
    _id: SHARED_ADDRESS,
    name: 'Finentic Shared NFT'
  })
  const [nftFormData, setNftFormData] = useState({
    name: '',
    is_phygital: false,
    properties: [],
    description: '',
    external_url: '',
  })

  useEffect(() => {
    const getCollectionData = async () => {
      try {
        const collectionOfSharedRes = getCollection(SHARED_ADDRESS)
        const collectionOfAccountRes = getAllCollectionOfAccount(eth.account._id)
        const collectionOfAccount = (await collectionOfAccountRes).data
        const collectionOfSharedData = (await collectionOfSharedRes).data
        setCollections([
          collectionOfSharedData,
          ...collectionOfAccount.filter(collection => collection._id !== collectionOfSharedData._id),
        ])
      } catch (error) {
        console.error(error)
      }

    }
    if (eth.account._id !== constants.AddressZero) getCollectionData()
  }, [eth.account._id])

  const handleCollectionSelected = (event) => {
    setCollectionSelected(collections[event.target.value])
  }

  const handleInputChange = event => {
    const target = event.target
    let value = target.value
    const name = target.name
    if (name === 'is_phygital') value = !nftFormData.is_phygital
    setNftFormData({ ...nftFormData, [name]: value })
  }

  const addProperty = () => {
    setProperties([...properties, properties.length])
    setNftFormData({
      ...nftFormData,
      properties: [
        ...nftFormData.properties,
        { _id: properties.length, name: '', value: '' }
      ]
    })
  }

  const removeProperty = (index) => {
    setProperties(properties.filter(element => element !== index))
    setNftFormData({
      ...nftFormData,
      properties: nftFormData.properties.filter(property => property._id !== index)
    })
  }

  const handleChangePropertyName = (index, name) => {
    const nextProperties = nftFormData.properties.map((property) => (property._id === index) ? { ...property, name } : property)
    setNftFormData({
      ...nftFormData,
      properties: nextProperties
    })
  }

  const handleChangePropertyValue = (index, value) => {
    const nextProperties = nftFormData.properties.map((property) => (property._id === index) ? { ...property, value } : property)
    setNftFormData({
      ...nftFormData,
      properties: nextProperties
    })
  }


  const getFileInfo = event => {
    if (event.target.files[0]
      && (event.target.files[0].type === 'image/jpeg'
        || event.target.files[0].type === 'image/jpg'
        || event.target.files[0].type === 'image/png')
    ) return setPictures([...event.target.files])

    else {
      setPictures([])
      document.getElementById('pictures').value = null
      window.scroll(0, document.getElementById('pictures'))
    }
  }

  const resetState = () => setButtonState(BUTTON_STATE.ENABLE)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setButtonState(BUTTON_STATE.PENDING)
    const { currentTarget } = event
    const CollectionContract = collectionContract(eth.signer, collectionSelected._id)
    const currentTokenId = await CollectionContract.currentTokenId()
    const formData = new FormData()
    formData.append('token_id', currentTokenId.toString())
    formData.append('owner_address', eth.account._id.toLowerCase())
    formData.append('name', nftFormData.name)
    formData.append('from_collection_address', CollectionContract.address)
    formData.append('description', nftFormData.description)
    formData.append('external_url', nftFormData.external_url)
    formData.append('is_phygital', !!nftFormData.is_phygital)
    for (const property of nftFormData.properties) {
      formData.append(
        'properties[]',
        JSON.stringify({
          name: property.name,
          value: property.value,
        })
      )
    }
    for (const file of currentTarget.pictures.files) {
      formData.append('files', file)
    }
    try {
      const response = await createItem(formData)
      console.log(response.data.hashed_metadata)
      await CollectionContract.mintAndApprove(
        eth.account._id,
        MARKETPLACE_ADDRESS,
        response.data.hashed_metadata,
      )
      setButtonState(BUTTON_STATE.DONE)
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.REJECTED)
    }
  }

  return (
    <div className='container py-4'>
      <h1 className='fw-bold h1'>Create an NFT</h1>
      <hr className='hr' />
      <div className='row'>
        <div className='col col-12 col-md-6'>
          <form onSubmit={handleSubmit}>
            <div className='form-group my-3'>
              <label className='fw-bold' htmlFor="collection">
                Collection <span className='text-danger'>*</span>
              </label>
              <br />
              <small className='text-muted'>
                This is the collection where your item will appear.
              </small>
              <select className='form-select' onChange={handleCollectionSelected}>
                {collections.length && collections.map((collection, index) => (
                  <option
                    value={index}
                    key={collection._id}
                  >
                    {collection.name} {'(' + collection.symbol + ')'}
                  </option>))
                }
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='pictures' className='fw-bold'>
                Pictures <span className='text-danger'>*</span>
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
              <label htmlFor='properties' className='fw-bold'>Properties:</label>
              <br />
              <small className='text-muted'>
                Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.
              </small>
              <Table bordered hover size="sm" className='bg-white'>
                {properties.length
                  ? <thead>
                    <tr>
                      <th className='text-center'>#</th>
                      <th>Name</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  : null
                }
                <tbody>
                  {properties.map((property, index) => (
                    <tr key={property}>
                      <td className='text-center'>
                        <div
                          onClick={() => removeProperty(nftFormData.properties[index]._id)}
                          className='btn btn-sm btn-outline-secondary'
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Color"
                          aria-label="Name"
                          className='input-transparent w-100'
                          value={nftFormData.properties[index].name}
                          maxLength={16}
                          onChange={(event) => handleChangePropertyName(index, event.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Pink"
                          aria-label="Value"
                          className='input-transparent w-100'
                          maxLength={16}
                          value={nftFormData.properties[index].value}
                          onChange={(event) => handleChangePropertyValue(index, event.target.value)}
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className='btn btn-sm btn-primary' onClick={addProperty}>
                <FontAwesomeIcon icon={faPlus} className='me-2' />
                Add field
              </div>
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

            <div className='form-group my-3'>
              <label htmlFor='external_url' className='fw-bold'>Shipping</label>
              <br />
              <small className='text-muted'>
                When an NFT that marked as "not require shipping", the system will skip the shipping step of the checkout process.
              </small>
              <div className="form-check form-switch">
                <input className="form-control form-check-input" type="checkbox" id="is_phygital" name="is_phygital" onChange={handleInputChange} />
                <label className="form-check-label" htmlFor="is_phygital">{!nftFormData.is_phygital ? 'Not require' : 'Require'} shipping</label>
              </div>
            </div>

            <div className='my-3 fw-bold fst-italic text-danger'>
              <FontAwesomeIcon icon={faExclamationTriangle} /> Freeze metadata:
              <span className='fw-normal text-dark'>
                { } Freezing metadata will permanently hash all required fields of this item content and store hashed metadata in blockchain.
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
          <CreatePreview nftFormData={nftFormData} eth={eth} pictures={pictures} collectionSelected={collectionSelected} />
        </div>
      </div>
    </div >
  )
}

export { Create }
