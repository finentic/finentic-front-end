import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
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
        <div onMouseEnter={() => setIsEditingAvatar(true)} style={{
            position: 'absolute',
            height: '100px',
            width: '100px',
        }}>
            <img
                src={avatar || srcThumbnail}
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
                accept='image/png, image/jpg, image/jpeg'
            />
        </div >
    )
}

export default Avatar