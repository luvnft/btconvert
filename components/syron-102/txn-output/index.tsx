import styles from '../../swap-form/dex-output/index.module.scss'
import React from 'react'
import Big from 'big.js'
import Image from 'next/image'
import tydradexSvg from '../../../src/assets/icons/ssi_tydradex.svg'
import { CryptoState } from '../../../src/types/vault'
import icoBTC from '../../../src/assets/icons/bitcoin.png'
import ico$RNT from '../../../src/assets/icons/ssi_$RNT_iso.svg'

Big.PE = 999

type Prop = {
    amount: Big
    token: CryptoState
}

export const TransactionOutput: React.FC<Prop> = ({ amount, token }) => {
    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.formActive}>
                    <div className={styles.content}>
                        <div className={styles.tokenDexRow}>
                            {/* <div className={styles.dummyIco2}>
                                <Image
                                    src={tydradexSvg}
                                    alt="SSI Vault"
                                    layout="responsive"
                                />
                            </div> */}
                            {/* be your bank */}
                            <div className={styles.dexName}>Receive Syron</div>
                        </div>
                        <div className={styles.output}>
                            <Image
                                src={token.symbol === 'BTC' ? icoBTC : ico$RNT}
                                alt={token.symbol}
                                key={token.symbol}
                                height="35"
                                width="35"
                                className={styles.symbol}
                            />
                            <input
                                disabled
                                value={Number(amount).toLocaleString()}
                                placeholder="0"
                                type="text"
                                className={styles.inputDex}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
