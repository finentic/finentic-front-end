import { toImgUrl } from "../../utils"
import { ButtonImg } from "../../components"

const ListingPreview = ({ listingForm, item }) => {
    return (
        <div className='card shadow w-25 rounded-3' style={{ position: 'fixed', minWidth: '250px', maxWidth: '560px' }}>
            <div
                className="h-100"
                style={{
                    backgroundImage: `url("${toImgUrl(item.thumbnail)}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
                }}
            >
                <div style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: 13,
                    left: 13,
                }}>
                    <ButtonImg
                        imgUrl={toImgUrl(item.from_collection.thumbnail)}
                        title={item.from_collection.name}
                        tooltip={item.from_collection.name + ' Collection'}
                        className='bg-light-50 cursor-no-click'
                    />
                </div>

                <img
                    src={toImgUrl(item.thumbnail)}
                    className="w-100"
                    draggable="false"
                    style={{
                        backdropFilter: "blur(4px) brightness(90%)",
                        objectFit: 'contain',
                        height: '250px',
                        borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0px 0px',
                    }}
                    alt={item.name}
                />
            </div>
            <div className="card-body">
                <h5 className="card-title text-nowrap overflow-hidden">
                    {item.name}
                </h5>
                <h6 className="card-subtitle text-muted mb-2 text-nowrap overflow-hidden">
                    {item.owner.name}
                </h6>
                <p className="card-text">
                    {(listingForm.price) + ' VND'}
                </p>
            </div>
        </div>
    )
}

export default ListingPreview