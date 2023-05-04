import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ButtonImg } from "../../components"
import { toImgUrl } from "../../utils"
import { faTruckFast } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

const ItemInfo = ({ name, from_collection, owner, ownership_history }) => {
  const navigate = useNavigate()

  return (
    <div className='pt-4 pb-2 px-2'>
      <ButtonImg
        imgUrl={toImgUrl(from_collection.thumbnail)}
        title={from_collection.name}
        tooltip={from_collection.name + ' Collection'}
        onClick={() => navigate(`/collection/${from_collection._id}`)}
      />
      <h1 className="col col-12 pt-2">
        {name}
      </h1>
      <div className='text-secondary'>
        <FontAwesomeIcon icon={faTruckFast} className='me-2' />
        Phygital NFT
      </div>
      <br />
      <div className='row'>
        <div className='col col-12 col-md-6'>
          <div className='rounded-3 shadow-sm p-2'>
            <div className='text-secondary pb-1'>
              Created by:
            </div>
            <ButtonImg
              imgUrl={toImgUrl(ownership_history[0].owner.avatar_thumb)}
              title={ownership_history[0].owner.name}
              tooltip={'Account of ' + ownership_history[0].owner.name}
              onClick={() => navigate(`/account/${ownership_history[0].owner._id}`)}
            />
          </div>
        </div>
        <div className='col col-12 col-md-6'>
          <div className='rounded-3 shadow-sm p-2'>
            <div className='text-secondary pb-1'>
              Owned by:
            </div>
            <ButtonImg
              imgUrl={toImgUrl(owner.avatar_thumb)}
              title={owner.name}
              tooltip={'Account of ' + owner.name}
              onClick={() => navigate(`/account/${owner._id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemInfo