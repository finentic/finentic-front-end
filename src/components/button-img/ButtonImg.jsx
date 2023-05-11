import { Button, Image, OverlayTrigger, Tooltip } from 'react-bootstrap'


function ButtonImg({ imgUrl, title, tooltip, onClick, className, size = 28, fontSize = 14 }) {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        tooltip
          ?
          <Tooltip id={title}>
            {tooltip}
          </Tooltip>
          : <></>
      }
    >
      {({ ref, ...triggerHandler }) => (
        <Button
          variant="light"
          {...triggerHandler}
          className={`d-inline-flex align-items-center py-0 ps-0 border-0 shadow-hover background-color-none-hover ${className}`}
          style={{
            borderRadius: (size / 2),
          }}
          onClick={onClick}
        >
          <Image
            ref={ref}
            roundedCircle
            src={imgUrl}
            height={size}
          />
          <span className="ms-1 fw-bold text-dark" style={{ fontSize: fontSize }}>{title}</span>
        </Button>
      )}
    </OverlayTrigger>
  );
}

export { ButtonImg }