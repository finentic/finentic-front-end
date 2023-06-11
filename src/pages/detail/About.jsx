import { TooltipCopy } from "../../components"
import { toTokenId, toAddressUrl, toRawUrl, timestampToDate, formatHexString } from "../../utils"

const About = ({ item }) => {
    return (
        <div>
            <div className="float-start">
                <strong className='text-third pe-2'>
                    Contract:
                </strong>
            </div>
            <div className="float-end">
                <TooltipCopy
                    contentLink={toAddressUrl(item.from_collection._id)}
                    contentCopy={item.from_collection._id}
                >
                    {item.from_collection.name}
                </TooltipCopy>
            </div>
            <br />

            <div className="float-start">
                <strong className='text-third pe-2'>
                    Token ID:
                </strong>
            </div>
            <div className="float-end">
                #{toTokenId(item._id)}
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

            <div className="float-start">
                <strong className='text-third pe-2'>
                    Create at:
                </strong>
            </div>
            <div className="float-end">
                {timestampToDate(item.createdAt)}
            </div>
            <br />

            <div className="float-start">
                <strong className='text-third pe-2'>
                    Raw data url:
                </strong>
            </div>
            <div className="float-end">
                <TooltipCopy
                    className='text-break text-secondary'
                    contentLink={toRawUrl(item._id)}
                    contentCopy={toRawUrl(item._id)}
                >
                    {formatHexString(item._id, 5, 8)}
                </TooltipCopy>
            </div>
            <br />

            <div className="float-start">
                <strong className='text-third pe-2'>
                    Raw data hash:
                </strong>
            </div>
            <div className="float-end">
                <TooltipCopy
                    contentCopy={item.hashed_metadata}
                    className='text-secondary'
                >
                    {formatHexString(item.hashed_metadata, 5, 8)}
                </TooltipCopy>
            </div>
            <br />


            {item.external_url && <>
                <div className="">
                    <strong className='text-third pe-2'>
                        External URL:
                    </strong>
                </div>
                <div className="">
                    <a
                        className='overflow-hidden text-wrap text-break text-secondary'
                        href={item.external_url}
                    >
                        {item.external_url}
                    </a>
                </div>
                <br />
            </>}
        </div >
    )
}

export default About