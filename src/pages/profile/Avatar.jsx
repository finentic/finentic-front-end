import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { updateAvatar } from '../../api'
import { toImgUrl } from '../../utils'


function Avatar({ _id, srcThumbnail }) {
    const [isEditingAvatar, setIsEditingAvatar] = useState(false)
    const [avatar, setAvatar] = useState(undefined)

    const handleUpdate = async (event) => {
        const picture = event.target.files[0]
        if (picture) {
            const formData = new FormData()
            formData.append('file', picture, picture.name)
            formData.append('account_address', _id)
            try {
                console.log(Object.fromEntries(formData))
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
        <div className='mb-2' style={{ display: 'grid', gridTemplate: '1fr / 1fr', placeItems: 'center' }}>
            <img
                src={avatar || srcThumbnail}
                onMouseEnter={() => setIsEditingAvatar(true)}
                className="rounded-circle"
                style={{
                    objectFit: 'cover',
                    height: '75px',
                    width: '75px',
                    zIndex: 1,
                    gridColumn: '1 / 1',
                    gridRow: '1 / 1'
                }} alt='avatar'
            />
            {isEditingAvatar
                ? <div
                    className="rounded-circle"
                    onMouseLeave={() => setIsEditingAvatar(false)}
                    style={{
                        height: '75px',
                        width: '75px',
                        zIndex: 2,
                        gridColumn: '1 / 1',
                        gridRow: '1 / 1',
                        backgroundColor: '#00000055'
                    }}
                >
                    <FontAwesomeIcon
                        icon={faPen}
                        className='text-light'
                        style={{
                            height: '32px',
                            width: '32px',
                            position: 'relative',
                            top: '20px',
                            zIndex: 2,
                            gridColumn: '1 / 1',
                            gridRow: '1 / 1'
                        }}
                    />
                    <label
                        htmlFor="picture"
                        className="rounded-circle"
                        style={{
                            position: 'relative',
                            top: '-45px',
                            height: '75px',
                            width: '75px',
                            zIndex: 3,
                            gridColumn: '1 / 1',
                            gridRow: '1 / 1'
                        }}
                    >
                    </label>
                </div>
                : null
            }
            <input
                className="rounded-circle"
                type='file'
                name='picture'
                id='picture'
                onChange={handleUpdate}
                hidden
                accept='image/png, image/jpg, image/jpeg'
            />
        </div>
    )
}

export default Avatar