import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { useNavigate } from 'react-router-dom'
import { ToastAutoHide } from '../../components'
import { API_BASE_URI } from '../../utils'
import { formatEther } from 'ethers/lib/utils'

function addressOverflow(address) {
    return `${address.substring(0, 3)}...${address.substring(39, 42)}`
}

function ItemCard({ item }) {
        const navigate = useNavigate()
        return (
        <div className='col-12 col-sm-6 col-lg-4 col-xl-3 mb-4' onClick={() => navigate(`/item/${item._id}`)}>
            <div className='card shadow-sm'>
                <img src={`${API_BASE_URI}/pictures/items/${item.picture}`} className="w-100" style={{ objectFit: 'cover', height: '250px' }} alt={item.name} />
                <div className="card-body">
                    <h5 className="card-title text-truncate">{item.name}</h5>
                    <h6 className="card-subtitle text-muted mb-2">From: {addressOverflow(item.seller)}</h6>
                    <div className='row'>
                        <div className='col text-start'>
                            <div className="card-text text-nowrap overflow-hidden text-secondary" style={{ textOverflow: 'ellipsis' }}>
                                <ToastAutoHide message='Copy' feedback='Copied!' title={addressOverflow(item._id)} content={item._id} />
                            </div>
                        </div>
                        <div className='col text-end'>
                            <p className="card-text">
                                <FontAwesomeIcon icon={faEthereum} className='text-primary' /> {(formatEther(item.price))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemCard;