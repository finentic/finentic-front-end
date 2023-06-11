import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ButtonImg } from '../../components'
import { ACCOUNT_STATE, toImgUrl } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

const ItemInfo = ({ name, from_collection, owner }) => {
  const navigate = useNavigate()

  return (
    <div className='py-2 px-1'>
      <ButtonImg
        imgUrl={toImgUrl(from_collection.thumbnail)}
        title={from_collection.name}
        tooltip={'Collection: ' + from_collection.name}
        onClick={() => navigate(`/collection/${from_collection._id}`)}
        size={36}
        fontSize={16}
      />
      <h1 className="col col-12 pt-2 fw-bold text-third">
        {name}
      </h1>
      <div className='text-secondary pb-2'>
        Owned by
        <span
          className="text-primary cursor-pointer"
          onClick={() => navigate(`/account/${owner._id}`)}
        >
          {<>
            { } {(owner.status === ACCOUNT_STATE.VERIFIED) && <FontAwesomeIcon
              icon={faCircleCheck}
              className='text-primary ps-1 pt-1'
            />}  {owner.name}
          </>}
        </span>
      </div>
    </div>
  )
}

export default ItemInfo