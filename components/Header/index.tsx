import { useStore } from "effector-react";
import React from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import {
  SearchBar,
  NewSSIModal,
  TransactionStatus,
  GetStartedModal,
  LogInModal,
  BuyNFTModal,
} from "../";
import { $menuOn } from "../../src/store/menuOn";
import { RootState } from "../../src/app/reducers";

function Header() {
  const newSSIModal = useSelector(
    (state: RootState) => state.modal.newSSIModal
  );
  const txStatusModal = useSelector(
    (state: RootState) => state.modal.txStatusModal
  );
  const getStartedModal = useSelector(
    (state: RootState) => state.modal.getStartedModal
  );
  const loginModal = useSelector((state: RootState) => state.modal.loginModal);
  const buyNFTModal = useSelector(
    (state: RootState) => state.modal.buyNFTModal
  );
  const menuOn = useStore($menuOn);

  return (
    <>
      <div id="header">
        <div className="content">
          <ToastContainer
            style={{ maxWidth: 500 }}
            closeButton={false}
            progressStyle={{ backgroundColor: "#eeeeee" }}
          />
          {!menuOn &&
            !txStatusModal &&
            !getStartedModal &&
            !newSSIModal &&
            !buyNFTModal &&
            !loginModal && (
              <div className="inner">
                <SearchBar />
              </div>
            )}
        </div>
      </div>
      {!menuOn && !txStatusModal && (
        <>
          <NewSSIModal />
          <GetStartedModal />
          <BuyNFTModal />
          <LogInModal />
        </>
      )}
      {!menuOn && <TransactionStatus />}
    </>
  );
}

export default Header;
