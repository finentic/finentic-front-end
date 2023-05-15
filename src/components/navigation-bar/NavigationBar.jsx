import { useState } from 'react'
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSearch,
    faWallet,
    faUser,
    faGear,
    faRightFromBracket,
    faPlug,
    faFolderPlus,
    faFilePen
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useEth } from '../../contexts'
import { ROUTERS_PATH } from '../../routers/MainRoutes'
import { constants } from 'ethers'

function NavigationBar(props) {
    const eth = useEth()
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(false);
    return (
        <Navbar expand="lg" bg="white" fixed="top" className='shadow-sm' expanded={expanded} style={{ height: 50 }}>
            <Container>
                <Navbar.Brand onClick={() => navigate('/')} className='cursor-pointer'>
                    <img
                        src="/logo/brand_V.png"
                        alt="FINENTIC"
                        height="32"
                        className="d-inline-block align-top"
                        draggable={false}
                        style={{
                            borderRadius: 'var(--bs-border-radius-sm) 0 0 var(--bs-border-radius-sm)'
                        }}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(!expanded)} />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="col"></Nav>
                    <Nav className="col-12 col-lg-6 me-4">
                        <form
                            className="input-group"
                            onSubmit={e => {
                                setExpanded(true)
                                e.preventDefault()
                                const value = document.getElementById('search').value
                                if (value) {
                                    props.handleKeywordsChange(value)
                                    navigate('/search')
                                }
                            }}
                        >
                            <label className="input-group-text bg-white" htmlFor='search'><FontAwesomeIcon icon={faSearch} /></label>
                            <input type="search" className="form-control form-control-sm" name='search' id='search' placeholder="Find index, item name, and address" />
                        </form>
                    </Nav>
                    <Nav className="col"></Nav>

                    <Nav>
                        {(eth.account && eth.account._id !== constants.AddressZero)
                            ? <NavDropdown
                                className='rounded-2 fw-bold'
                                title={<><FontAwesomeIcon icon={faWallet} className='pe-2' /> {eth.account.name}</>}
                                id="collasible-nav-dropdown"
                            >
                                <NavDropdown.Item onClick={() => {
                                    setExpanded(false)
                                    navigate(ROUTERS_PATH.create)
                                }}>
                                    <FontAwesomeIcon
                                        icon={faFilePen}
                                        className='text-third pe-2'
                                        style={{ width: 20 }}
                                    /> Create Item
                                </NavDropdown.Item>

                                <NavDropdown.Item onClick={() => {
                                    setExpanded(false)
                                    navigate(ROUTERS_PATH.createCollection)
                                }}>
                                    <FontAwesomeIcon
                                        icon={faFolderPlus}
                                        className='text-third pe-2'
                                        style={{ width: 20 }}
                                    /> Create Collection
                                </NavDropdown.Item>

                                <NavDropdown.Item onClick={() => {
                                    setExpanded(false)
                                    navigate(ROUTERS_PATH.account + eth.account._id)
                                }}>
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className='text-third pe-2'
                                        style={{ width: 20 }}
                                    />  Your Profile
                                </NavDropdown.Item>

                                <NavDropdown.Item onClick={() => {
                                    setExpanded(false)
                                    navigate('/setting')
                                }}>
                                    <FontAwesomeIcon
                                        icon={faGear}
                                        className='text-third pe-2'
                                        style={{ width: 20 }}
                                    /> Setting
                                </NavDropdown.Item>

                                <NavDropdown.Divider />

                                <NavDropdown.Item onClick={() => {
                                    setExpanded(false)
                                }}>
                                    <FontAwesomeIcon
                                        icon={faRightFromBracket}
                                        className='text-third pe-2'
                                        style={{ width: 20 }}
                                    /> Disconnect
                                </NavDropdown.Item>
                            </NavDropdown>
                            : <Nav.Link className='fw-bold' onClick={() => {
                                setExpanded(false)
                                navigate('/account/' + eth.account._id)
                            }}>
                                <FontAwesomeIcon
                                    icon={faPlug}
                                    className='text-third pe-2'
                                    style={{ width: 20 }}
                                /> Connect
                            </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export { NavigationBar }