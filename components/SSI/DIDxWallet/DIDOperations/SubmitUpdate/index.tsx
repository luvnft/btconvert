import * as tyron from "tyron";
import * as zcrypto from "@zilliqa-js/crypto";
import { useStore } from "effector-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { $contract } from "../../../../../src/store/contract";
import { $donation, updateDonation } from "../../../../../src/store/donation";
import styles from "./styles.module.scss";
import { decryptKey, operationKeyPair } from "../../../../../src/lib/dkms";
import { $arconnect } from "../../../../../src/store/arconnect";
import { $doc } from "../../../../../src/store/did-doc";
import { $net } from "../../../../../src/store/wallet-network";
import { ZilPayBase } from "../../../../ZilPay/zilpay-base";

function Component({ patches }: { patches: tyron.DocumentModel.PatchModel[] }) {
  const donation = useStore($donation);
  const contract = useStore($contract);
  const arConnect = useStore($arconnect);
  const dkms = useStore($doc)?.dkms;
  const net = useStore($net);

  const [txID, setTxID] = useState("");

  const handleSubmit = async () => {
    const key_input = [
      {
        id: tyron.VerificationMethods.PublicKeyPurpose.Update,
      },
    ];
    if (arConnect !== null && contract !== null && donation !== null) {
      try {
        const verification_methods: tyron.TyronZil.TransitionValue[] = [];
        const doc_elements: tyron.DocumentModel.DocumentElement[] = [];

        for (const input of key_input) {
          // Creates the cryptographic DID key pair
          const doc = await operationKeyPair({
            arConnect: arConnect,
            id: input.id,
            addr: contract.addr,
          });
          verification_methods.push(doc.parameter);
          doc_elements.push(doc.element);
        }

        const zilpay = new ZilPayBase();

        const patches_ = await tyron.Sidetree.Sidetree.processPatches(
          contract.addr,
          patches
        );
        const document = verification_methods.concat(patches_.updateDocument);
        const doc_elements_ = doc_elements.concat(patches_.documentElements);

        const hash = await tyron.DidCrud.default.HashDocument(doc_elements_);
        const encrypted_key = dkms.get("update");
        const update_private_key = await decryptKey(arConnect, encrypted_key);
        const update_public_key =
          zcrypto.getPubKeyFromPrivateKey(update_private_key);
        const signature = zcrypto.sign(
          Buffer.from(hash, "hex"),
          update_private_key,
          update_public_key
        );

        const tyron_ = await tyron.TyronZil.default.OptionParam(
          tyron.TyronZil.Option.some,
          "Uint128",
          String(Number(donation) * 1e12)
        );
        const tx_params = await tyron.TyronZil.default.CrudParams(
          contract.addr,
          document,
          await tyron.TyronZil.default.OptionParam(
            tyron.TyronZil.Option.some,
            "ByStr64",
            "0x" + signature
          ),
          tyron_
        );

        toast.info(`You're about to submit a DID Update transaction. You're also donating ZIL ${donation} to donate.did!`, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        const res = await zilpay.call({
          contractAddress: contract.addr,
          transition: "DidUpdate",
          params: tx_params as unknown as Record<string, unknown>[],
          amount: String(donation), //@todo-ux would u like to top up your wallet as well?
        });
        setTxID(res.ID);
        updateDonation(null);
      } catch (error) {
        toast.error("identity verification unsuccessful.", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    }
  };

  return (
    <>
      {donation !== null && (
        <div style={{ marginTop: "10%" }}>
          <button onClick={handleSubmit}>
            <span style={{ color: "yellow" }}>update did</span>
          </button>
        </div>
      )}
      {txID !== "" && (
        <div style={{ marginLeft: "-1%" }}>
          <code>
            Transaction ID:{" "}
            <a
              href={`https://viewblock.io/zilliqa/tx/${txID}?network=${net}`}
              rel="noreferrer"
              target="_blank"
            >
              {txID}
            </a>
          </code>
        </div>
      )}
    </>
  );
}

export default Component;
