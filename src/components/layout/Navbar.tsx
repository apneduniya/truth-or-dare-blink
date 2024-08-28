"use client"

import dynamic from 'next/dynamic';


const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);


export default function Navbar() {
    return (
        <nav className="flex flex-wrap justify-between items-center py-4 px-4 sm:px-10">
            <h1 className="text-2xl font-bold">Truth & Dare</h1>
            <WalletMultiButtonDynamic />
        </nav>
    )
}



