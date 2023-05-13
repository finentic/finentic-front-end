import { usePageTitle } from '../../hooks'
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import Name from './Name'
import { Tab, Tabs } from 'react-bootstrap'
import { formatHexString, toAddressUrl, toImgUrl } from '../../utils'
import { TooltipCopy } from '../../components'
import { useParams } from 'react-router-dom'
import { getAccount } from '../../api'


function Profile({ pageTitle }) {
  usePageTitle(pageTitle)
  const { accountId } = useParams()
  const [accountDetail, setAccountDetail] = useState(false)

  useEffect(() => {
    const getItemList = async () => {
      try {
        const accountResponse = await getAccount(accountId)
        console.log(accountResponse)
        setAccountDetail(accountResponse.data)
      } catch (error) { }
    }
    getItemList()
    return () => setAccountDetail()
  }, [accountId])

  if (!accountDetail) return null
  return (<ProfileBody
    accountDetail={accountDetail}
    key={accountDetail._id}
  />)
}

function ProfileBody({ accountDetail }) {
  usePageTitle(accountDetail.name)

  return (
    <div className='container py-4'>
      <div className='row py-4'>
        <div className='col' style={{ maxWidth: 100 }}>
          <Avatar srcThumbnail={toImgUrl(accountDetail.thumbnail)} _id={accountDetail._id} />
        </div>
        <div className='col ps-4 pt-2'>
          <Name accountDetail={accountDetail} />
          <TooltipCopy
            title={accountDetail.name}
            contentCopy={accountDetail._id}
            contentLink={toAddressUrl(accountDetail._id)}
            className={'fs-5'}
          >
            {formatHexString(accountDetail._id, 5, 5)}
          </TooltipCopy>

        </div>
      </div>

      <div className='pt-4'>
        <Tabs
          defaultActiveKey="items"
          transition={true}
          className="mb-3"
        >
          <Tab eventKey="items" title="Items">
            {/* <MyItem accountId={accountDetail._id} /> */}
          </Tab>
          <Tab eventKey="sales" title="Sales order">
            {/* <MyOrder accountId={this.props.account._id} web3={this.props.web3} order='sales' /> */}
          </Tab>
          <Tab eventKey="purchase" title="Purchase order">
            {/* <MyOrder accountId={this.props.account._id} web3={this.props.web3} order='purchase' /> */}
          </Tab>
        </Tabs>
      </div>
    </div >
  )
}

export { Profile }
