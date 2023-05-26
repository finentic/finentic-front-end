import { Routes, Route, Navigate } from "react-router-dom"
import {
  Create,
  Error404,
  Error500,
  Error503,
  Home,
  ItemDetail,
  Listing,
  TokenSale,
  Edit,
  Profile,
  CreateCollection,
  Collection,
} from "../pages"
import { NavigationBar } from "../components"

const ROUTERS_PATH = {
  account: 'account/',
  create: 'create/',
  createCollection: 'create/collection/',
  collection: 'collection/',
  error500: 'error-500/',
  error503: 'error-500/',
  error404: 'error-404/',
  home: 'home/',
  item: 'item/',
}

const MainRoutes = () => {
  return (
    <>
      <NavigationBar />
      <div style={{ paddingTop: "50px" , minHeight: '100vh'}} className="bg-light">
        <Routes >
          <Route path="/">
            <Route index element={<Home pageTitle="Home" />} />
            <Route path={ROUTERS_PATH.home} element={<Navigate to="/" replace />} />

            {/* Account */}
            <Route path={`${ROUTERS_PATH.account}:accountId`} element={<Profile pageTitle="Account profile" />} />

            {/* Create */}
            <Route path={ROUTERS_PATH.create} element={<Create pageTitle="Create NFT" />} />
            <Route path={ROUTERS_PATH.createCollection} element={<CreateCollection pageTitle="Create Collection" />} />

            {/* Collection */}
            <Route path={`${ROUTERS_PATH.collection}:collectionId`} element={<Collection pageTitle="About Collection" />} />

            {/* Item */}
            <Route path={`${ROUTERS_PATH.item}:itemId`} element={<ItemDetail pageTitle="Detail" />} />
            <Route path={`${ROUTERS_PATH.item}:itemId/listing`} element={<Listing pageTitle="List for sale" />} />
            <Route path={`${ROUTERS_PATH.item}:itemId/edit`} element={<Edit pageTitle="Edit Item" />} />

            <Route path="tokenSale" element={<TokenSale pageTitle="Buy FxETH" />} />

            {/* Error */}
            <Route path="*" element={<Error404 pageTitle="Not found" />} />
            <Route path={ROUTERS_PATH.error500} element={<Error500 pageTitle="Internal server error" />} />
            <Route path={ROUTERS_PATH.error503} element={<Error503 pageTitle="Service temporarily unavailable" />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export { MainRoutes, ROUTERS_PATH }
