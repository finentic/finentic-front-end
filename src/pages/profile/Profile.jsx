import { usePageTitle } from '../../hooks'
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import Name from './Name'
import { Tab, Tabs } from 'react-bootstrap'
import { useEth } from '../../contexts'
import { toImgUrl } from '../../utils'
import { ToastAutoHide } from '../../components'
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
  console.log(accountDetail)
  return (<ProfileBody
    accountDetail={accountDetail}
    key={accountDetail._id}
  />)
}

function ProfileBody({ accountDetail }) {
  const { eth } = useEth()
  usePageTitle(accountDetail.name)

  return (
    <div className='container py-4'>
      <div className='row py-4 text-center'>
        <div className='col col-12'>
          <Avatar srcThumbnail={toImgUrl(accountDetail.thumbnail)} _id={accountDetail._id} />
        </div>
        <div className='col col-12 col-md-6 col-lg-4 mx-auto'>
          <Name accountName={accountDetail.name} _id={accountDetail._id} />
        </div>
        <div className='text-secondary col col-12'>
          <ToastAutoHide
            message='Copy'
            feedback='Copied!'
            title={accountDetail._id}
            content={accountDetail._id}
          />
        </div>
      </div>

      <div className='row'>
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
