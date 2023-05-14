import React, { useEffect, useState } from 'react'
import { updateName } from '../../api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { ACCOUNT_STATE } from '../../utils'


function AccountName({ accountDetail, isOwner }) {
    const [editNameElement, setEditNameElement] = useState(false)
    const [accountName, setAccountName] = useState('')
    const [newName, setNewName] = useState('')

    useEffect(() => {
        setAccountName(accountDetail.name)
        setNewName(accountDetail.name)
    }, [accountDetail.name])

    const handleNameSubmit = async event => {
        try {
            event.preventDefault()
            await updateName({
                account_address: accountDetail._id,
                name: newName,
            })
            setAccountName(newName)
            hideEditNameElement()
        } catch (error) {
            console.error(error)
        }
    }

    const handleNameChange = event => {
        setNewName(event.target.value)
    }

    const showEditNameElement = () => {
        isOwner && setEditNameElement(true)
    }

    const hideEditNameElement = () => {
        setEditNameElement(false)
    }

    return (
        <div onClick={showEditNameElement}>
            <label
                className={editNameElement ? 'd-none' : 'd-block'}
                htmlFor="accountName">
                <h2 className='h2 fw-bold text-third cursor-text'>
                    {accountName} {(accountDetail.status === ACCOUNT_STATE.VERIFIED) && <FontAwesomeIcon
                        icon={faCircleCheck}
                        className='text-primary fs-3'
                    />}
                </h2>
            </label>
            {editNameElement ? (
                <form className={editNameElement ? 'd-block' : 'd-none'} onSubmit={handleNameSubmit}>
                    <input
                        type='text'
                        name='accountName'
                        id='accountName'
                        maxLength='32'
                        className='input-transparent p-0 h2 fw-bold text-third'
                        onBlur={hideEditNameElement}
                        onChange={handleNameChange}
                        value={newName}
                        required
                    />
                </form>
            ) : null}
        </div>
    )
}

export default AccountName