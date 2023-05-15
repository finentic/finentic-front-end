import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { updateCollectionPicture } from '../../api'
import { formatHexString, toAddressUrl, toImgUrl } from '../../utils'
import { TooltipCopy } from '../../components'
import CollectionDescription from './CollectionDescription'


function CollectionBasicInfo({ collectionDetail, isOwner }) {
    const [isEditingPicture, setIsEditingPicture] = useState(false)
    const [newPicture, setNewPicture] = useState(undefined)

    const handleUpdate = async (event) => {
        const picture = event.target.files[0]
        if (picture) {
            try {
                const formData = new FormData()
                formData.append('collection_address', collectionDetail._id)
                formData.append('file', picture)
                const response = await updateCollectionPicture(formData)
                setNewPicture(response.data)
                document.getElementById('picture').value = null
            } catch (error) {
                console.error(error)
            }
        } else {
            document.getElementById('picture').value = null
            window.scroll(0, document.getElementById('picture'))
        }
    }

    return (
        <div
            style={{
                backgroundImage: `url("${toImgUrl(newPicture || collectionDetail.thumbnail)}")`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                height: 200,
            }}
        >
            <div className='' style={{
                backgroundColor: 'rgb(255 255 255 / 0.8)',
                backdropFilter: "blur(8px)",
                height: 205,
            }}>
                <div className='container py-4'>
                    <div className='row py-4'>
                        <div className='col col-12 col-md-6'>
                            <form onMouseEnter={() => isOwner && setIsEditingPicture(true)} style={{
                                position: 'absolute',
                                height: '100px',
                                width: '100px',
                            }} onSubmit={(event) => event.preventDefault()}>
                                <img
                                    src={toImgUrl(newPicture || collectionDetail.thumbnail)}
                                    className="rounded-3 h-100 w-100"
                                    style={{ objectFit: 'cover' }}
                                    alt={collectionDetail.name}
                                />

                                <label
                                    htmlFor="picture"
                                    className="rounded-3"
                                    onMouseLeave={() => setIsEditingPicture(false)}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        opacity: isEditingPicture ? 1 : 0,
                                        height: '100px',
                                        width: '100px',
                                        backdropFilter: "blur(4px) brightness(50%)",
                                        transition: 'opacity 0.2s linear',
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faImage}
                                        className='text-light'
                                        style={{
                                            position: 'inherit',
                                            height: 32,
                                            width: 32,
                                            top: 35,
                                            left: 35
                                        }}
                                    />
                                </label>
                                <input
                                    className="rounded-3"
                                    type='file'
                                    name='picture'
                                    id='picture'
                                    onChange={handleUpdate}
                                    hidden
                                    disabled={!isOwner}
                                    accept='image/png, image/jpg, image/jpeg'
                                />
                            </form >

                            <div className='ps-4 pt-2' style={{ marginLeft: 100 }}>
                                <h2 className='h2 fw-bold text-third cursor-none'>
                                    {collectionDetail.name}
                                </h2>
                                <TooltipCopy
                                    contentCopy={collectionDetail._id}
                                    contentLink={toAddressUrl(collectionDetail._id)}
                                    className={'fs-4'}
                                >
                                    <span className='fw-bold'>
                                        {collectionDetail.symbol}
                                    </span> {`(${formatHexString(collectionDetail._id)})`}
                                </TooltipCopy>
                            </div>
                        </div>
                        <CollectionDescription collectionDetail={collectionDetail} isOwner={isOwner} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CollectionBasicInfo