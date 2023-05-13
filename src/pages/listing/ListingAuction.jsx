import { forwardRef } from "react"
import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap"

const ListingAuction = forwardRef(({
    listingForm,
    handleInputChange,
    datetimeStart,
    datetimeEnded,
}, ref) => {
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
                        ref={ref}
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
                    Auction duration must last more than 1 hour
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
                        min={datetimeStart.toISOString().slice(0, 16)}
                        required
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
                        min={datetimeEnded.toISOString().slice(0, 16)}
                        required
                    />
                </div>
            </div>
        </>
    )
})

export default ListingAuction