import { faUpRightFromSquare, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from 'react-bootstrap'

function ModalImg({ show, onHide, imgSrc, name, onOpenNewTab }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{
                backdropFilter: "brightness(80%)",
            }}
        >
            <Modal.Header className='pt-1 pb-0 ps-3 pe-1 fs-5'>
                <Modal.Title id="contained-modal-title-vcenter">
                    {name}
                </Modal.Title>
                <div className='float-right'>
                    {onOpenNewTab && <FontAwesomeIcon
                        icon={faUpRightFromSquare}
                        onClick={onOpenNewTab}
                        width={35}
                        className='me-2 shadow-hover p-2'
                    />}
                    <FontAwesomeIcon
                        icon={faX}
                        onClick={onHide}
                        width={35}
                        className='shadow-hover p-2'
                    />
                </div>
            </Modal.Header>
            <Modal.Body className='p-0'>
                <img
                    src={imgSrc}
                    alt={name}
                    className="h-100 w-100"
                    style={{
                        borderRadius: '0px 0px var(--bs-border-radius) var(--bs-border-radius)',
                    }}
                />
            </Modal.Body>
        </Modal>
    )
}

export { ModalImg }