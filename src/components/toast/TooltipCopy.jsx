import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

function TooltipCopy({
    children,
    contentCopy,
    contentLink,
    contentLinkTooltip,
    className,
}) {
    const [tooltipContentCopy, setTooltipContentCopy] = useState('Copy')

    const copyToClipboard = event => {
        event.stopPropagation()
        // await navigator.clipboard.writeText(contentCopy)
        const textField = document.createElement('textarea')
        textField.innerText = contentCopy
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()

        setTooltipContentCopy('Copied!')
    }

    const openNewTab = () => {
        window.open(contentLink)
    }

    const showTooltipCopy = () => {
        setTooltipContentCopy('Copy to clipboard')
    }

    const hideTooltipCopy = () => {
        setTimeout(() => setTooltipContentCopy('Copy to clipboard'), 120)
    }

    return (
        <span className={'text-third ' + className}>
            {contentLink && (
                <span
                    aria-label={contentLinkTooltip || 'View in explorer'}
                    className="cooltipz--bottom-left cooltipz-bg-color-light"
                >
                    <FontAwesomeIcon
                        icon={faUpRightFromSquare}
                        onClick={openNewTab}
                        className='text-secondary'
                    /> { }
                </span>
            )}
            <span
                aria-label={tooltipContentCopy}
                className="cooltipz--bottom"
                onClick={copyToClipboard}
                onMouseEnter={showTooltipCopy}
                onMouseLeave={hideTooltipCopy}
            >
                {children}
            </span>
        </span>
    )
}

export { TooltipCopy }
