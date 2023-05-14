import { useState } from 'react'
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faSearch, faWallet, faUser, faGear, faRightFromBracket, faPlug } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useEth } from '../../contexts'

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
                        {(eth.account && eth.account._id !== '0x0000000000000000000000000000000000000000')
                            ? <NavDropdown
                                className='rounded-2 fw-bold'
                                title={<><FontAwesomeIcon icon={faWallet} className='pe-2' /> {eth.account.name}</>}
                                id="collasible-nav-dropdown"
                            >
                                <NavDropdown.Item onClick={() => {
                                    setExpanded(false)
                                    navigate('/create')
                                }}>
                                    <FontAwesomeIcon icon={faPen} className='text-third pe-2' /> Create
                                </NavDropdown.Item>

                                <NavDropdown.Item onClick={() => {
                                    setExpanded(false)
                                    navigate('/account/' + eth.account._id)
                                }}>
                                    <FontAwesomeIcon icon={faUser} className='text-third pe-2' /> Profile
                                </NavDropdown.Item>

                                <NavDropdown.Item onClick={() => {
                                    setExpanded(false)
                                    navigate('/setting')
                                }}>
                                    <FontAwesomeIcon icon={faGear} className='text-third pe-2' /> Setting
                                </NavDropdown.Item>

                                <NavDropdown.Divider />

                                <NavDropdown.Item onClick={() => {
                                    setExpanded(false)
                                    props.logout()
                                }}>
                                    <FontAwesomeIcon icon={faRightFromBracket} className='text-third pe-2' /> Disconnect
                                </NavDropdown.Item>
                            </NavDropdown>
                            : <Nav.Link className='fw-bold me-4' onClick={() => {
                                setExpanded(false)
                                navigate('/account/' + eth.account._id)
                            }}>
                                <FontAwesomeIcon icon={faPlug} className='text-third pe-2' /> Connect
                            </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export { NavigationBar }