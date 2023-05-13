import React, { useState } from 'react'
import { updateName } from '../../api'
import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { ACCOUNT_STATE } from '../../utils'


function Name({ accountDetail }) {
    const [editNameElement, setEditNameElement] = useState(false)
    const [accountName, setAccountName] = useState(accountDetail.name)
    const [newName, setNewName] = useState(accountDetail.name)

    const handleNameSubmit = async event => {
        try {
            event.preventDefault()
            await updateName({
                account_address: accountDetail._id,
                name: newName,
            })
            setAccountName(newName)
            this.hideEditNameElement()
        } catch (error) {
            console.error(error)
        }
    }

    const handleNameChange = event => {
        setNewName(event.target.value)
    }

    const showEditNameElement = () => {
        setEditNameElement(true)
    }

    const hideEditNameElement = () => {
        setEditNameElement(false)
    }

    return (
        <div onClick={showEditNameElement}>
            <label
                className={editNameElement ? 'd-none' : 'd-block'}
                htmlFor="accountName">
                <h2 className='fw-bold text-third'>
                    {accountName} {(accountDetail.status === ACCOUNT_STATE.VERIFIED) && <FontAwesomeIcon
                        icon={faCircleCheck}
                        className='text-primary fs-3'
                    />}
                </h2>
            </label>
            {editNameElement ? (
                <form className={editNameElement ? 'd-block' : 'd-none'} onSubmit={handleNameSubmit}>
                    <Form.Control
                        type='text'
                        size='lg'
                        name='accountName'
                        id='accountName'
                        maxLength='32'
                        className='py-0'
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

export default Name