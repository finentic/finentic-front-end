import { faChain, faIdCard, faList, faTable } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Accordion } from "react-bootstrap"
import About from "./About"


const ItemDescription = ({ item }) => {
  return (
    <div className='rounded-3 h-100 w-100' style={{ whiteSpace: 'pre-line' }}>
      <Accordion defaultActiveKey={['Description', 'Properties', 'About', 'Details']} alwaysOpen>
        <Accordion.Item eventKey='Description'>
          <Accordion.Header>
            <FontAwesomeIcon icon={faList} />
            <span className='fw-bold ms-2'>
              Description
            </span>
          </Accordion.Header>
          <Accordion.Body className='bg-light text-center'>
            {item.description || <div className='text-center text-secondary fw-bold'>
              This item has no description yet. {'\n'} Contact the owner about setting it up.
            </div>}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey='Properties' hidden={(!item.properties.length)}>
          <Accordion.Header>
            <FontAwesomeIcon icon={faTable} />
            <span className='fw-bold ms-2'>
              Properties
            </span>
          </Accordion.Header>
          <Accordion.Body className='bg-light'>
            <div className='row py-n3'>
              {item.properties.map(property => (
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

        <Accordion.Item eventKey={'About'}>
          <Accordion.Header>
            <FontAwesomeIcon icon={faIdCard} />
            <span className='fw-bold ms-2'>
              {'About ' + item.from_collection.name}
            </span>
          </Accordion.Header>
          <Accordion.Body className='bg-light text-center'>
            {item.from_collection.description || <div className='text-center text-secondary fw-bold'>
              This collection has no description yet. {'\n'} Contact the creator about setting it up.
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
            <About item={item} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default ItemDescription