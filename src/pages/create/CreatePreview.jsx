import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBolt, faChain, faCircleCheck, faIdCard, faList, faTable, faTruckFast } from "@fortawesome/free-solid-svg-icons"
import { Accordion } from "react-bootstrap"
import CreatePreviewPictures from "./CreatePreviewPictures"
import { useNavigate } from "react-router-dom"
import { ACCOUNT_STATE, SHARED_ADDRESS, toAddressUrl } from "../../utils"
import { TooltipCopy } from "../../components"

const CreatePreview = ({ nftFormData, pictures, eth }) => {
    const navigate = useNavigate()
    return (
        <>
            <div className='pb-2 px-1'>
                <h3 className="col col-12 pt-2 fw-bold text-third">
                    {nftFormData.name || 'Preview'}
                </h3>
                <div className='text-secondary pb-2' hidden={!nftFormData.is_phygital}>
                    <FontAwesomeIcon icon={faTruckFast} className='me-2' />
                    Required shipping
                </div>
                <div className='text-secondary pb-2' hidden={nftFormData.is_phygital}>
                    <FontAwesomeIcon icon={faBolt} className='me-2' />
                    Not required shipping
                </div>
                <div className='text-secondary pb-2'>
                    Owned by
                    <span
                        className="text-primary cursor-pointer"
                        onClick={() => navigate(`/account/${eth.account._id}`)}
                    >
                        {<>
                            { } {(eth.account.status === ACCOUNT_STATE.VERIFIED) && <FontAwesomeIcon
                                icon={faCircleCheck}
                                className='text-primary ps-1 pt-1'
                            />} {eth.account.name}
                        </>}
                    </span>
                </div>
            </div>

            <CreatePreviewPictures pictures={pictures} />

            <div className='py-3'>
                <div className='rounded-3 h-100 w-100' style={{ whiteSpace: 'pre-line' }}>
                    <Accordion defaultActiveKey={['Description']} alwaysOpen>
                        <Accordion.Item eventKey='Description'>
                            <Accordion.Header>
                                <FontAwesomeIcon icon={faList} />
                                <span className='fw-bold ms-2'>
                                    Description
                                </span>
                            </Accordion.Header>
                            <Accordion.Body className='bg-light'>
                                {nftFormData.description || <div className='text-center text-secondary fw-bold'>
                                    This item has no description yet. {'\n'} Contact the owner about setting it up.
                                </div>}
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey='Properties' hidden={(!nftFormData.properties.length)}>
                            <Accordion.Header>
                                <FontAwesomeIcon icon={faTable} />
                                <span className='fw-bold ms-2'>
                                    Properties
                                </span>
                            </Accordion.Header>
                            <Accordion.Body className='bg-light'>
                                <div className='row py-n3'>
                                    {nftFormData.properties.map(property => (
                                        <div key={property._id} className='col-6 text-center p-2'>
                                            <div className='card p-2'>
                                                <div className='fw-bold text-secondary text-decoration-uppercase'>
                                                    {property.name}
                                                </div>
                                                <div className='fw-bold text-third'>
                                                    {property.value}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey={'About ' + eth.account.name}>
                            <Accordion.Header>
                                <FontAwesomeIcon icon={faIdCard} />
                                <span className='fw-bold ms-2'>
                                    {'About ' + eth.account.name}
                                </span>
                            </Accordion.Header>
                            <Accordion.Body className='bg-light'>
                                {eth.account.bio || <div className='text-center text-secondary fw-bold'>
                                    This creator has no bio yet. {'\n'} Contact the creator about setting it up.
                                </div>}
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey='Details'>
                            <Accordion.Header>
                                <FontAwesomeIcon icon={faChain} />
                                <span className='fw-bold ms-2'>
                                    Details
                                </span>
                            </Accordion.Header>
                            <Accordion.Body className='bg-light'>
                                <div>
                                    <div className="float-start">
                                        <strong className='text-third pe-2'>
                                            Contract:
                                        </strong>
                                    </div>
                                    <div className="float-end">
                                        <TooltipCopy
                                            contentLink={toAddressUrl(SHARED_ADDRESS)}
                                            contentCopy={SHARED_ADDRESS}
                                        >
                                            Shared NFT
                                        </TooltipCopy>
                                    </div>
                                    <br />

                                    <div className="float-start">
                                        <strong className='text-third pe-2'>
                                            Token standard:
                                        </strong>
                                    </div>
                                    <div className="float-end">
                                        ERC-721
                                    </div>
                                    <br />

                                    {nftFormData.external_url && <>
                                        <div className="float-start">
                                            <strong className='text-third pe-2'>
                                                External URL:
                                            </strong>
                                        </div>
                                        <div className="float-end">
                                            <a
                                                className='overflow-hidden text-wrap text-break text-secondary'
                                                href={nftFormData.external_url}
                                            >
                                                {nftFormData.external_url}
                                            </a>
                                        </div>
                                        <br />
                                    </>}
                                </div >
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        </>
    )
}

export default CreatePreview