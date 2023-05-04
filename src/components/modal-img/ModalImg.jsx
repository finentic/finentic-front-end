import { Modal } from 'react-bootstrap'

function ModalImg({ show, onHide, imgSrc, name }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{
                backdropFilter: "brightness(80%)",
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className='fs-6'>
                    {name}
                </Modal.Title>
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