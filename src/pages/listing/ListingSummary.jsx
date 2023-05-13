import { commify } from "ethers/lib/utils"
import { PERCENTAGE, toBN } from "../../utils"

const ListingSummary = ({ listingForm, serviceFeePercent }) => {
    const price = toBN(listingForm.price.replaceAll(',', ''))
    return (
        <div className='py-3'>
            <p className='fw-bold fs-5'>
                Summary
            </p>
            <div className='row'>
                <div className='col-6'>
                    Listing price
                </div>
                <div className='col-6 text-end'>
                    {listingForm.price} VND
                </div>
            </div>
            <div className='row'>
                <div className='col-6'>
                    Service fee
                </div>
                <div className='col-6 text-end'>
                    {commify((serviceFeePercent * 100 / PERCENTAGE))} %
                </div>
            </div>
            <hr className='hr' />
            <div className='row fw-bold fs-5'>
                <div className='col-6'>
                    Total potential earnings
                </div>
                <div className='col-6 text-end'>
                    {commify(price.sub(price.mul(serviceFeePercent).div(PERCENTAGE)))} VND
                </div>
            </div>
        </div>
    )
}

export default ListingSummary