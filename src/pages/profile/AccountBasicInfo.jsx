import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { updateAvatar } from '../../api'
import { formatHexString, toAddressUrl, toImgUrl } from '../../utils'
import { TooltipCopy } from '../../components'
import AccountName from './AccountName'
import AccountBio from './AccountBio'


function AccountBasicInfo({ account, isOwner }) {
    const [isEditingAvatar, setIsEditingAvatar] = useState(false)
    const [avatar, setAvatar] = useState(undefined)

    const handleUpdate = async (event) => {
        const picture = event.target.files[0]
        if (picture) {
            try {
                const formData = new FormData()
                formData.append('account_address', account._id)
                formData.append('file', picture)
                const response = await updateAvatar(formData)
                setAvatar(toImgUrl(response.data))
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
                backgroundImage: `url("${avatar || toImgUrl(account.thumbnail)}")`,
                // backgroundRepeat: 'no-repeat',
                backgroundSize: '10px auto',
                height: 200,
            }}
        >
            <div className='' style={{
                backgroundColor: 'rgb(255 255 255 / 0.8)',
                backdropFilter: "blur(4px)",
                height: 205,
            }}>
                <div className='container py-4'>
                    <div className='row py-4'>
                        <div className='col col-12 col-md-6'>
                            <form onMouseEnter={() => isOwner && setIsEditingAvatar(true)} style={{
                                position: 'absolute',
                                height: '100px',
                                width: '100px',
                            }} onSubmit={(event) => event.preventDefault()}>
                                <img
                                    src={avatar || toImgUrl(account.thumbnail)}
                                    className="rounded-3 h-100 w-100"
                                    style={{ objectFit: 'cover' }} alt='avatar'
                                />

                                <label
                                    htmlFor="picture"
                                    className="rounded-3"
                                    onMouseLeave={() => setIsEditingAvatar(false)}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        opacity: isEditingAvatar ? 1 : 0,
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
                                <AccountName accountDetail={account} isOwner={isOwner} />
                                <TooltipCopy
                                    contentCopy={account._id}
                                    contentLink={toAddressUrl(account._id)}
                                    className={'fs-5'}
                                >
                                    {formatHexString(account._id, 5, 5)}
                                </TooltipCopy>
                            </div>
                        </div>
                        <AccountBio account={account} isOwner={isOwner} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountBasicInfo