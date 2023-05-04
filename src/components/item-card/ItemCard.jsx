import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { toImgUrl } from '../../utils'
import { formatEther } from 'ethers/lib/utils'
import { faDongSign } from '@fortawesome/free-solid-svg-icons'
import { ButtonImg } from '../button-img'


function ItemCard({ item }) {
    const navigate = useNavigate()
    return (
        <div className='col-12 col-sm-6 col-lg-4 col-xl-3 mb-4' onClick={() => navigate(`/item/${item._id}`)}>
            <div className='card rounded-3 shadow-sm'>
                <div
                    className="h-100 w-100"
                    style={{
                        backgroundImage: `url("${toImgUrl(item.thumbnail)}")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        zIndex: 1,
                        top: 13,
                        left: 13,
                    }}>
                        <ButtonImg
                            imgUrl={toImgUrl(item.from_collection.thumbnail)}
                            title={item.from_collection.name}
                            tooltip={item.from_collection.name + ' Collection'}
                            className='bg-light-50'
                            onClick={() => navigate(`/collection/${item.from_collection._id}`)}
                        />
                    </div>

                    <img
                        src={toImgUrl(item.thumbnail)}
                        className="w-100"
                        draggable="false"
                        style={{
                            backdropFilter: "blur(4px) brightness(90%)",
                            objectFit: 'contain',
                            height: '250px',
                            borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
                        }}
                        alt={item.name}
                    />
                </div>
                <div className="card-body">
                    <h5 className="card-title text-nowrap overflow-hidden">{item.name}</h5>
                    <h6 className="card-subtitle text-muted mb-2 text-nowrap overflow-hidden">{item.owner.name}</h6>
                    <p className="card-text">
                        {(item.price)
                            ? (formatEther(item.price) + ' VND')
                            : 'Not for sale'
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export { ItemCard };