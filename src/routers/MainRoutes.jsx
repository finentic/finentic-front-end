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
} from "../pages"
import { NavigationBar } from "../components"

const ROUTERS_PATH = {
  home: 'home/',
  create: 'create/',
  item: 'item/',
  account: 'account/',
  error500: 'error-500/',
  error503: 'error-500/',
  error404: 'error-404/',
}

const MainRoutes = () => {
  return (
    <>
      <NavigationBar />
      <div style={{ marginTop: "50px" }} className="bg-light">
        <Routes >
          <Route path="/">
            <Route index element={<Home pageTitle="Home" />} />
            <Route path={ROUTERS_PATH.home} element={<Navigate to="/" replace />} />
            <Route path="tokenSale" element={<TokenSale pageTitle="Buy FxETH" />} />
            <Route path={ROUTERS_PATH.create} element={<Create pageTitle="Create NFT" />} />
            <Route path={`${ROUTERS_PATH.item}:itemId`} element={<ItemDetail pageTitle="Detail" />} />
            <Route path={`${ROUTERS_PATH.item}:itemId/listing`} element={<Listing pageTitle="List for sale" />} />
            <Route path={`${ROUTERS_PATH.item}:itemId/edit`} element={<Edit pageTitle="Edit item" />} />
            <Route path={`${ROUTERS_PATH.account}:accountId`} element={<Profile pageTitle="Account profile" />} />

            {/* for error routes */}
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
