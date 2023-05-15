import { usePageTitle } from '../../hooks'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import AccountBasicInfo from './AccountBasicInfo'
import { Tab, Tabs } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getAccount } from '../../api'
import { useEth } from '../../contexts'
import { AccountCreated } from './AccountCreated'
import { AccountCollected } from './AccountCollected'
import { AccountSales } from './AccountSales'


function Profile() {
  const { accountId } = useParams()
  const [accountDetail, setAccountDetail] = useState()

  const getAccountData = useCallback(async (_accountId) => {
    try {
      const accountResponse = await getAccount(_accountId)
      setAccountDetail(accountResponse.data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    if (accountId) getAccountData(accountId)
  }, [accountId, getAccountData])

  const accountMemo = useMemo(() => ({ accountDetail }), [accountDetail])

  if (!accountMemo.accountDetail) return null
  return (<ProfileBodyMemo
    accountDetail={accountMemo.accountDetail}
    key={accountId}
  />)
}

const ProfileBodyMemo = memo(ProfileBody, (prevProps, nextProps) => prevProps.accountDetail._id === nextProps.accountDetail._id)

function ProfileBody({ accountDetail }) {
  usePageTitle(accountDetail.name)
  const eth = useEth()
  const isOwner = (accountDetail._id.toLowerCase() === eth.account?._id.toLowerCase())

  return (
    <>
      <AccountBasicInfo account={accountDetail} isOwner={isOwner} />

      <div className='container py-3'>
        <div className='pt-4'>
          <Tabs
            fill
            justify
            // variant='pills'
            defaultActiveKey="collected"
            className=""
          >
            <Tab eventKey="collected" title="Collected">
              <AccountCollected accountDetail={accountDetail} />
            </Tab>
            <Tab eventKey="created" title="Created">
              <AccountCreated accountDetail={accountDetail} />
            </Tab>
            <Tab eventKey="sales" title="Sales orders">
              <AccountSales accountDetail={accountDetail} />
            </Tab>
            <Tab eventKey="purchase" title="Purchase order">
              <div className='p-3' style={{
                background: '#fff',
                backgroundImage: 'linear-gradient(235deg, #fff, #f8f9fa)',
              }}>
                <div className='btn btn-secondary me-2 rounded-pill disabled'>All orders</div>
                <div className='btn btn-secondary me-2 rounded-pill'>Shipping</div>
                <div className='btn btn-secondary me-2 rounded-pill'>Completed</div>
                <div className='btn btn-secondary me-2 rounded-pill'>Canceled</div>
              </div>
              {/* <MyOrder accountId={this.props.account._id} web3={this.props.web3} order='purchase' /> */}
            </Tab>
          </Tabs>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div >
    </>
  )
}

export { Profile }
