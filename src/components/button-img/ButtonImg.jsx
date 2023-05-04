import { Button, Image, OverlayTrigger, Tooltip } from 'react-bootstrap'


function ButtonImg({ imgUrl, title, tooltip, onClick, className }) {
    return (
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id={title}>
            {tooltip}
          </Tooltip>
        }
      >
        {({ ref, ...triggerHandler }) => (
          <Button
            variant="light"
            {...triggerHandler}
            className={`d-inline-flex align-items-center py-0 ps-0 border-0 shadow-hover background-color-none-hover ${className}`}
            style={{
              borderRadius: '16px',
            }}
            onClick={onClick}
          >
            <Image
              ref={ref}
              roundedCircle
              src={imgUrl}
              height='32px'
            />
            <span className="ms-1">{title}</span>
          </Button>
        )}
      </OverlayTrigger>
    );
  }

export { ButtonImg }