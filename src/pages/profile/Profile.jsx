import { usePageTitle } from '../../hooks'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import AccountBasicInfo from './AccountBasicInfo'
import { Tab, Tabs } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getAccount } from '../../api'
import { useEth } from '../../contexts'
import { AccountCollected } from './AccountCollected'
import { AccountSales } from './AccountSales'
import { AccountPurchase } from './AccountPurchase'


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
            <Tab eventKey="sales" title="Sales orders">
              <AccountSales accountDetail={accountDetail} />
            </Tab>
            <Tab eventKey="purchase" title="Purchase order">
              <AccountPurchase accountDetail={accountDetail} />
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
