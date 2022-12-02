import { ReactNode, useEffect } from 'react'
import { useStore } from 'effector-react'
import Head from 'next/head'
import {
    Header,
    Footer,
    Menu,
    Dashboard,
    NewSSIModal,
    BuyNFTModal,
    DashboardModal,
    GetStartedModal,
    NewMotionsModal,
    TransactionStatus,
    Spinner,
    Body,
    ZilPay,
} from '..'
import { $menuOn } from '../../src/store/menuOn'
import { $loading, $loadingDoc } from '../../src/store/loading'
import {
    $modalDashboard,
    $modalNewSsi,
    $modalTx,
    $modalGetStarted,
    $modalBuyNft,
    $modalAddFunds,
    $modalWithdrawal,
    $modalNewMotions,
    $modalInvestor,
    updateShowZilpay,
    $showZilpay,
} from '../../src/store/modal'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '../../src/app/reducers'
// import { ZilPayBase } from '../ZilPay/zilpay-base'
// import { toast } from 'react-toastify'
// import toastTheme from '../../src/hooks/toastTheme'

interface LayoutProps {
    children: ReactNode
}

function LayoutSearch(props: LayoutProps) {
    const { children } = props
    const { asPath } = useRouter()
    const Router = useRouter()
    const language = useSelector((state: RootState) => state.modal.lang)
    const menuOn = useStore($menuOn)
    const loading = useStore($loading)
    const loadingDoc = useStore($loadingDoc)
    const modalDashboard = useStore($modalDashboard)
    const modalNewSsi = useStore($modalNewSsi)
    const modalTx = useStore($modalTx)
    const modalGetStarted = useStore($modalGetStarted)
    const modalBuyNft = useStore($modalBuyNft)
    const modalNewMotions = useStore($modalNewMotions)
    const modalAddFunds = useStore($modalAddFunds)
    const modalWithdrawal = useStore($modalWithdrawal)
    const modalInvestor = useStore($modalInvestor)
    const loginInfo = useSelector((state: RootState) => state.modal)
    // const isLight = useSelector((state: RootState) => state.modal.isLight)

    const bg = loginInfo.isLight ? 'bglight' : 'bg'

    useEffect(() => {
        Router.push({}, asPath, { locale: language })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language])

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Head>
                <title>TYRON</title>
            </Head>
            <div id={bg} />
            <div id="wrapper">
                <Header />
                <Body>{children}</Body>
                <Footer />
            </div>
        </div>
    )
}

export default LayoutSearch
