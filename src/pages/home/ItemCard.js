import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URI } from '../../utils'
import { formatEther } from 'ethers/lib/utils'
import { faDongSign } from '@fortawesome/free-solid-svg-icons'


function ItemCard({ item }) {
    const navigate = useNavigate()
    return (
        <div className='col-12 col-sm-6 col-lg-4 col-xl-3 mb-4' onClick={() => navigate(`/item/${item._id}`)}>
            <div className='card shadow-sm'>
                <img src={`${API_BASE_URI}/${item.thumbnail}`} className="w-100" style={{ objectFit: 'cover', height: '250px' }} alt={item.name} />
                <div className="card-body">
                    <h5 className="card-title text-truncate">{item.name}</h5>
                    <h6 className="card-subtitle text-muted mb-2 text-nowrap overflow-hidden">{item.owner.name}</h6>
                    <div className='row'>
                        <div className='col text-start'>
                            <div className="card-text text-nowrap overflow-hidden text-secondary" style={{ textOverflow: 'ellipsis' }}>
                            {item.from_collection.name}
                            </div>
                        </div>
                        <div className='col text-end'>
                            {console.log(item)}
                            <p className="card-text">
                                {(item.price)
                                    ? <><FontAwesomeIcon icon={faDongSign} className='text-primary' /> {(formatEther(item.price))}</>
                                    : 'Not for sale'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemCard;