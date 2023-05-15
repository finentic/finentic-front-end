import { usePageTitle } from '../../hooks'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCollection } from '../../api'
import { useEth } from '../../contexts'
import { CollectionItems } from './CollectionItems'
import CollectionBasicInfo from './CollectionBasicInfo'


function Collection() {
  const { collectionId } = useParams()
  const [collectionDetail, setCollectionDetail] = useState()

  const getCollectionData = useCallback(async (_collectionId) => {
    try {
      const collectionResponse = await getCollection(_collectionId)
      console.log(collectionResponse)
      setCollectionDetail(collectionResponse.data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    if (collectionId) getCollectionData(collectionId)
  }, [collectionId, getCollectionData])

  const collectionMemo = useMemo(() => (collectionDetail), [collectionDetail])

  if (!collectionMemo) return null
  return (<CollectionBodyMemo
    collectionDetail={collectionMemo}
    key={collectionId}
  />)
}

const CollectionBodyMemo = memo(CollectionBody, (prevProps, nextProps) => prevProps.collectionDetail._id === nextProps.collectionDetail._id)

function CollectionBody({ collectionDetail }) {
  usePageTitle(collectionDetail.name)
  const eth = useEth()
  const isOwner = (collectionDetail.creator.toLowerCase() === eth.account?._id.toLowerCase())

  return (
    <>
      <CollectionBasicInfo collectionDetail={collectionDetail} isOwner={isOwner} />
      <div className='container py-3'>
          <CollectionItems collectionDetail={collectionDetail} />
      </div >
    </>
  )
}

export { Collection }
