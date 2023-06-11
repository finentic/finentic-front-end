import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ACCOUNT_STATE, formatHexString, timestampToDate, toImgUrl, toTxUrl } from "../../utils"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { Image } from "react-bootstrap"

const OwnershipHistory = ({ ownership_history, navigate }) => {
    return (
        <div className="table-responsive">
            <table className="table text-nowrap">
                <thead>
                    <tr>
                        <th scope="col">Owner</th>
                        <th scope="col">Timestamp</th>
                        <th scope="col">Txn Hash</th>
                    </tr>
                </thead>
                <tbody>
                    {ownership_history.map(ownership => (
                        <tr key={ownership.timestamp}>
                            <td
                                className="cursor-pointer"
                                onClick={() => navigate(`/account/${ownership.account._id}`)}
                            >
                                <Image
                                    src={toImgUrl(ownership.account.thumbnail)}
                                    height={24}
                                    style={{
                                        marginTop: '-4px',
                                        borderRadius: 'var(--bs-border-radius-sm)',
                                    }}
                                />
                                <span className="ms-2 fw-bold text-third" style={{ fontSize: 16 }}>
                                    {ownership.account.name}
                                    {(ownership.account.status === ACCOUNT_STATE.VERIFIED) && <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className='text-primary ps-1 pt-1'
                                    />}
                                </span>
                            </td>
                            <td>
                                {timestampToDate(Number(ownership.timestamp + '000'))}
                            </td>
                            <td
                                className='text-decoration-underline cursor-pointer'
                                onClick={() => window.open(toTxUrl(ownership.tx_hash))}
                            >
                                {formatHexString(ownership.tx_hash)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default OwnershipHistory