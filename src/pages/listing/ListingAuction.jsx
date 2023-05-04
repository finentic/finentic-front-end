import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap"

const ListingAuction = ({ listingForm, handleInputChange }) => {
    return (
        <>
            <div className='form-group py-3'>
                <span className='fw-bold fs-5'>
                    Starting price
                </span>
                <br />
                <small className='text-muted'>
                </small>
                <InputGroup className="">
                    <Form.Control
                        id='price'
                        name='price'
                        size='lg'
                        type='text'
                        onChange={handleInputChange}
                        value={listingForm.price}
                    />
                    <DropdownButton
                        variant="outline-secondary"
                        title="VND"
                        id="currency"
                        align="end"
                    >
                        <Dropdown.Item href="#">VND - Vietnamese Dong</Dropdown.Item>
                        <Dropdown.Item href="#" disabled>USDC - USD Coin</Dropdown.Item>
                    </DropdownButton>
                </InputGroup>
            </div>
            <div className='form-group '>
                <span className='fw-bold fs-5'>Duration</span>
                <br />
                <small className='text-muted'>
                </small>
            </div>
            <div className='form-group mb-3 row'>
                <div className='col col-12 col-md-6 py-2'>
                    <span className='fw-bold fs-6'>Starting</span>
                    <br />
                    <small className='text-muted'>
                        { }
                    </small>
                    <Form.Control
                        name='startTime'
                        value={listingForm.startTime}
                        onChange={handleInputChange}
                        type='datetime-local'
                    />
                </div>

                <div className='col col-12 col-md-6 py-2'>
                    <span className='fw-bold fs-6'>Ending</span>
                    <br />
                    <small className='text-muted'>
                    </small>
                    <Form.Control
                        name='endTime'
                        value={listingForm.endTime}
                        onChange={handleInputChange}
                        type='datetime-local'
                    />
                </div>
            </div>
        </>
    )
}

export default ListingAuction