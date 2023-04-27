import { Routes, Route, Navigate } from "react-router-dom";
import {
  Create,
  Error404,
  Error500,
  Error503,
  Home,
  TokenSale,
} from "../pages";
import { NavigationBar } from "../components";

const MainRoutes = () => {
  return (
    <>
      <NavigationBar />
      <div style={{ marginTop: "66px" }}></div>
      <Routes >
        <Route path="/">
          <Route index element={<Home pageTitle="Home" />} />
          <Route path="home" element={<Navigate to="home" replace />} />
          <Route path="tokenSale" element={<TokenSale pageTitle="Buy FxETH" />} />
          <Route path="create" element={<Create pageTitle="Create NFT" />} />

          {/* for error routes */}
          <Route path="*" element={<Error404 pageTitle="Not found" />} />
          <Route path="error-500" element={<Error500 pageTitle="Internal server error" />} />
          <Route path="error-503" element={<Error503 pageTitle="Service temporarily unavailable" />} />
        </Route>
      </Routes>
    </>
  );
};

export default MainRoutes;
