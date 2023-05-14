import { useEffect, useState } from 'react'
import { Button, Image, OverlayTrigger, Tooltip } from 'react-bootstrap'


function TimeCountdown({ timeRemaining, className }) {
  const [timeCountdown, setTimeCountdown] = useState(timeRemaining)
  useEffect(() => {
    if (timeCountdown > 0) setTimeout(() => setTimeCountdown(timeCountdown - 1), 1000)
  }, [timeCountdown])
  return (
    <span className={className}>
      {Math.floor(timeCountdown / 86400)}d { }
      {Math.floor((timeCountdown % 86400) / 3600 % 24)}h { }
      {Math.floor((timeCountdown % 86400) / 60 % 60)}m { }
      {Math.floor((timeCountdown % 86400) % 60)}s { }
    </span>
  )
}

export { TimeCountdown }