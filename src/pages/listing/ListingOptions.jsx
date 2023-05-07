const ListingOptions = ({ handleInputChange }) => {
    return (
        <div className='form-group my-3 row'>
            <span className='fw-bold fs-5'> Choose a type of sale</span>
            <label htmlFor='fixed' className='py-2'>
                <div className='card w-100 p-3 rounded-3 shadow-hover'>
                    <div className='row'>
                        <div className='col'>
                            <span className='fw-bold'>
                                Fixed price
                            </span>
                            <br />
                            <small className='text-muted'>
                                The item is listed at the price you set.
                            </small>
                        </div>
                        <div className='col-2 text-end align-middle'>
                            <input
                                name='method'
                                id='fixed'
                                onChange={handleInputChange}
                                type='radio'
                                defaultChecked
                                value='fixed'
                                style={{
                                    height: '20px',
                                    width: '20px',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </label>
            <br />

            <label htmlFor='auction' className='py-2'>
                <div className='card w-100 p-3 rounded-3 shadow-hover'>
                    <div className='row'>
                        <div className='col'>
                            <span className='fw-bold'>
                                Timed auction
                            </span>
                            <br />
                            <small className='text-muted'>
                                The item is listed for auction.
                            </small>
                        </div>
                        <div className='col-2 text-end align-middle'>
                            <input
                                name='method'
                                id='auction'
                                value='auction'
                                onChange={handleInputChange}
                                type='radio'
                                style={{
                                    height: '20px',
                                    width: '20px',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </label>
        </div>
    )
}

export default ListingOptions