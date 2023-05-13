import { faImage } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { memo } from "react"
import { Carousel } from "react-bootstrap"

const CreatePreviewPictures = memo(({ pictures }) => {
    if (!pictures.length) return (
        <label className="my-2 card bg-grey border-0 rounded-3" style={{ height: 300 }} htmlFor="pictures">
            <FontAwesomeIcon
                icon={faImage}
                className='text-secondary'
                style={{
                    position: 'inherit',
                    top: 70,
                    left: 5
                }}
                size="10x"
            />
        </label>
    )

    if (pictures.length > 1) return (
        <div className='my-2' style={{ height: 300 }}>
            <div className='rounded-3 border w-100' >
                <Carousel fade interval={null} pause={'hover'}>
                    {pictures.map((picture) => picture &&
                        <Carousel.Item key={picture.name}>
                            <div
                                className="rounded-3 w-100"
                                style={{
                                    backgroundImage: `url("${URL.createObjectURL(picture)}")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    height: 300,
                                }}
                            >
                                <img
                                    src={URL.createObjectURL(picture)}
                                    draggable="false"
                                    className="w-100 rounded-3"
                                    style={{
                                        backdropFilter: "blur(4px) brightness(90%)",
                                        objectFit: "contain",
                                        height: 300,
                                    }}
                                    alt={picture.name}
                                />
                            </div>
                        </Carousel.Item>
                    )}
                </Carousel>
            </div>
        </div>
    )

    return (
        <div className='my-2'>
            <div className='rounded-3 border w-100'>
                <div
                    className="rounded-3 w-100"
                    style={{
                        backgroundImage: `url("${URL.createObjectURL(pictures[0])}")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        height: 300,
                    }}
                >
                    <img
                        src={URL.createObjectURL(pictures[0])}
                        draggable="false"
                        className="w-100 rounded-3"
                        style={{
                            backdropFilter: "blur(4px) brightness(90%)",
                            objectFit: "contain",
                            height: 300,
                        }}
                        alt={pictures[0].name}
                    />
                </div>
            </div>
        </div>
    )
})

export default CreatePreviewPictures