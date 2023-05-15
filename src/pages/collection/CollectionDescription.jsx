import React, { useState } from 'react'
import { updateCollectionDescription } from '../../api'

function CollectionDescription({ collectionDetail, isOwner }) {
    const [editDescriptionElement, setEditDescriptionElement] = useState(false)
    const [collectionDescription, setCollectionDescription] = useState(collectionDetail.description || '')
    const [newDescription, setNewDescription] = useState(collectionDetail.description || '')

    const handleDescriptionChange = event => {
        setNewDescription(event.target.value)
    }

    const showEditDescriptionElement = () => {
        isOwner && setEditDescriptionElement(true)
    }

    const hideEditDescriptionElement = async () => {
        try {
            await updateCollectionDescription({
                collection_address: collectionDetail._id,
                description: newDescription,
            })
            setCollectionDescription(newDescription)
            setEditDescriptionElement(false)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <label
            onClick={showEditDescriptionElement}
            className={`d-none d-md-block col col-md-6 ps-4 pt-2 text-center text-line fst-italic ${isOwner && 'cooltipz--top cursor-text'}`}
            aria-label='Click to edit your collection description'
            htmlFor="collectionDescription"
        >
            <span className={editDescriptionElement ? 'd-none' : 'd-block cursor-text'} style={{ height: 78, overflowY: 'scroll' }}>
                {collectionDescription}
            </span>
            {editDescriptionElement ? (
                <form className={editDescriptionElement ? 'd-block' : 'd-none'}>
                    <textarea
                        type='text'
                        name='collectionDescription'
                        id='collectionDescription'
                        maxLength='256'
                        className='w-100 input-transparent p-0 text-center'
                        onBlur={hideEditDescriptionElement}
                        onChange={handleDescriptionChange}
                        value={newDescription}
                        style={{ height: 78, wordBreak: 'break-word', resize: 'none' }}
                    />
                </form>
            ) : null}
        </label>
    )
}

export default CollectionDescription