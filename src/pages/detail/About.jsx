import { ToastAutoHide } from "../../components"
import { toRawUrl } from "../../utils"

const About = ({ item }) => {
    return (
        <p>

            <strong className='text-dark pe-2'>From collection:</strong>
            <ToastAutoHide
                message='Copy'
                feedback='Copied!'
                title={item.from_collection.name}
                content={item.from_collection._id}
            /><br />
            <strong className='text-dark pe-2'>Create at: </strong> {(item.createdAt).substring(0, 10)}<br />
            <strong className='text-dark pe-2'>External URL:</strong>
            <a
                className='overflow-hidden text-wrap text-break text-secondary'
                href={item.external_url}
            >
                {item.external_url}
            </a><br />

            <strong className='text-dark pe-2'>Raw data url:</strong><br />
            <a
                className='text-break text-secondary'
                href={toRawUrl(item._id)}
            >
                {toRawUrl(item._id)}
            </a><br />
            <strong className='text-dark pe-2'>Raw data hash:</strong><br />
            <p className='text-secondary'>
                <ToastAutoHide
                    message='Copy'
                    feedback='Copied!'
                    title={item.hashed_metadata}
                    content={item.hashed_metadata} />
            </p>
        </p>
    )
}

export default About