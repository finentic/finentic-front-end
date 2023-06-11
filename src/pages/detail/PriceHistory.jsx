import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ButtonImg } from "../../components"
import { ACCOUNT_STATE, formatPrice, timestampToDate, toImgUrl, toTxUrl } from "../../utils"
import { faCircleCheck, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons"
import { Image } from "react-bootstrap"

const PriceHistory = ({ price_history, navigate }) => {
    return (
        <div className="table-responsive">
            <table className="table text-nowrap" hidden={(!price_history.length)}>
                <thead>
                    <tr>
                        <th scope="col">Offerer</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {price_history.map(priceHistory => (
                        <tr key={priceHistory.tx_hash}>
                            <td
                                className="cursor-pointer"
                                onClick={() => navigate(`/account/${priceHistory.account._id}`)}
                            >
                                <Image
                                    src={toImgUrl(priceHistory.account.thumbnail)}
                                    height={24}
                                    style={{
                                        marginTop: '-4px',
                                        borderRadius: 'var(--bs-border-radius-sm)',
                                    }}
                                />
                                <span className="ms-2 fw-bold text-third" style={{ fontSize: 16 }}>
                                    {priceHistory.account.name}
                                    {(priceHistory.account.status === ACCOUNT_STATE.VERIFIED) && <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className='text-primary ps-1 pt-1'
                                    />}
                                </span>
                            </td>
                            <td>
                                {formatPrice(priceHistory.amount)} VND
                            </td>
                            <td
                                className='cursor-pointer'
                                onClick={() => window.open(toTxUrl(priceHistory.tx_hash))}
                            >
                                {timestampToDate(Number(priceHistory.timestamp + '000'))}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='fw-bold text-center text-secondary' hidden={(price_history.length)}>
                <FontAwesomeIcon
                    icon={faClockRotateLeft}
                    size="2x"
                    className="pb-2"
                />
                <br />
                No events have occurred yet
            </div>
        </div>
    )
}

export default PriceHistory