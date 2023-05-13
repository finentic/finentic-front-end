import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Accordion } from "react-bootstrap"

const CardInfo = ({ children, maxHeight, className, title, icon, defaultActive }) => {
    return (
        <div className='py-3'>
            <div className={`rounded-3 h-100 w-100 ${className}`} style={maxHeight ?? { maxHeight: maxHeight, }}>
                <Accordion defaultActiveKey={defaultActive && title}>
                    <Accordion.Item eventKey={title}>
                        {title && (
                            <Accordion.Header>
                                <FontAwesomeIcon icon={icon} />
                                <span className='fw-bold ms-2'>
                                    {title}
                                </span>
                            </Accordion.Header>
                        )}
                        <Accordion.Body className='bg-light'>
                            {children}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </div>
    )
}

export default CardInfo