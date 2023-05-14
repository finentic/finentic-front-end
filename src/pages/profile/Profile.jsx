import { usePageTitle } from '../../hooks'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import AccountBasicInfo from './AccountBasicInfo'
import { Tab, Tabs } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getAccount } from '../../api'
import { useEth } from '../../contexts'


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
    if (accountId) {
      console.log(accountId)
      getAccountData(accountId)
    }
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
