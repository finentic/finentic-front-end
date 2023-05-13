import { forwardRef } from "react"
import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap"

const ListingFixedPrice = forwardRef((
    { listingForm, handleInputChange }, ref
) => {
    return (
        <>
            <div className='form-group py-3'>
                <span className='fw-bold fs-5'>
                    Set a price
                </span>
                <br />
                <small className='text-muted'>
                </small>
                <InputGroup className="pb-2">
                    <Form.Control
                        id='price'
                        name='price'
                        size='lg'
                        type='text'
                        value={listingForm.price}
                        onChange={handleInputChange}
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
        </>
    )
})

export default ListingFixedPrice