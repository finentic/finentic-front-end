import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ButtonImg } from "../../components"
import { ACCOUNT_STATE, formatHexString, timestampToDate, toImgUrl, toTxUrl } from "../../utils"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"

const OwnershipHistory = ({ ownership_history, navigate }) => {
    return (
        <table className="table">
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
                        <td>
                            <ButtonImg
                                imgUrl={toImgUrl(ownership.account.thumbnail)}
                                title={<>
                                    {ownership.account.name} {(ownership.account.status === ACCOUNT_STATE.VERIFIED) && <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className='text-primary ps-1 pt-1'
                                    />}
                                </>}
                                onClick={() => navigate(`/account/${ownership.account._id}`)}
                            />
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
    )
}

export default OwnershipHistory