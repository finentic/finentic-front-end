import { usePageTitle } from '../../hooks'
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import Name from './Name'
import { Tabs } from 'react-bootstrap'
import { useEth } from '../../contexts'
import { toImgUrl } from '../../utils'
import { ToastAutoHide } from '../../components'
import { useParams } from 'react-router-dom'
import { getAccount } from '../../api'


function Profile({ pageTitle }) {
  usePageTitle(pageTitle)
  const { eth } = useEth()
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
    eth={eth}
    accountDetail={accountDetail}
    key={accountDetail._id}
  />)
}

function ProfileBody({ eth, accountDetail }) {
  usePageTitle(accountDetail.name)

  return (
    <div className='container py-4'>
      <img
        alt='background cover'
        className="mt-5 w-100"
        style={{
          objectFit: 'cover',
          height: '280px',
          position: 'absolute',
          left: '0px',
          top: '0px',
          zIndex: -1
        }}
        src='background_cover.jpg'
      />
      <div className='row mb-4'>
        <div className='col-12 text-center'>
          <Avatar avatar={toImgUrl(accountDetail.thumbnail)} _id={accountDetail._id} />
          <Name accountName={accountDetail.name} _id={accountDetail._id} />
          <h4 className='text-muted'>
            <ToastAutoHide
              message='Copy'
              feedback='Copied!'
              title={accountDetail._id}
              content={accountDetail._id}
            />
          </h4>
        </div>
      </div>
      <div className='row'>
        <Tabs
          defaultActiveKey="items"
          transition={true}
          className="mb-3"
        >
          {/*<Tab eventKey="items" title="Items">
            <MyItem accountId={accountDetail._id} />
          </Tab>
           <Tab eventKey="sales" title="Sales order">
            <MyOrder accountId={this.props.account._id} web3={this.props.web3} order='sales' />
          </Tab>
          <Tab eventKey="purchase" title="Purchase order">
            <MyOrder accountId={this.props.account._id} web3={this.props.web3} order='purchase' />
          </Tab> */}
        </Tabs>
      </div>
    </div>
  )
}

export { Profile }
