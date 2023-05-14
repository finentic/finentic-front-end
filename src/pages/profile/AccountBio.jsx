import React, { useState } from 'react'
import { updateBio } from '../../api'

function AccountBio({ account, isOwner }) {
    const [editBioElement, setEditBioElement] = useState(false)
    const [accountBio, setAccountBio] = useState(account.bio || '')
    const [newBio, setNewBio] = useState(account.bio || '')

    const handleBioSubmit = async () => {
        try {
            await updateBio({
                account_address: account._id,
                bio: newBio,
            })
            setAccountBio(newBio)
            hideEditBioElement()
        } catch (error) {
            console.error(error)
        }
    }

    const handleBioChange = event => {
        setNewBio(event.target.value)
    }

    const showEditBioElement = () => {
        isOwner && setEditBioElement(true)
    }

    const hideEditBioElement = () => {
        setEditBioElement(false)
    }

    return (
        <label
            onClick={showEditBioElement}
            className={`d-none d-md-block col col-md-6 ps-4 pt-2 text-center ${isOwner && 'cooltipz--left cursor-text'}`}
            aria-label='Click to edit your bio'
            htmlFor="accountBio"
        >
            <span className={editBioElement ? 'd-none' : 'd-block cursor-text'} style={{ height: 78, overflowY: 'scroll' }}>
                {accountBio}
            </span>
            {editBioElement ? (
                <form className={editBioElement ? 'd-block' : 'd-none'}>
                    <textarea
                        type='text'
                        name='accountBio'
                        id='accountBio'
                        maxLength='256'
                        className='w-100 input-transparent p-0 text-center'
                        onBlur={hideEditBioElement}
                        onChange={handleBioChange}
                        value={newBio}
                        style={{ height: 78, wordBreak: 'break-word', resize: 'none' }}
                        onKeyDown={(event) => (event.key === 'Enter') && handleBioSubmit()}
                    />
                </form>
            ) : null}
        </label>
    )
}

export default AccountBio