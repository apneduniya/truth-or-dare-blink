import { PublicKey } from "@solana/web3.js";
import { generateTextImage } from "./textOverImage";
// import { kv } from "@vercel/kv";


async function saveImageAndWalletAddress(imgURL: string, walletAddress: PublicKey | null, type: "truth" | "dare") {
    /**
     * This function will save the image URL and wallet address to the KV store
     * 
     * @param imgURL - The image URL to save
     * @param walletAddress - The wallet address to save
     * @param type - The type of the truth or dare
     * @returns The random key
     */

    const randomKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // Generate a random key like "a1b2c3d4e5f6g7h8i9j0"

    // await kv.set(randomKey, {
    //     "imgURL": imgURL,
    //     "walletAddress": walletAddress,
    //     "type": type
    // });

    // SET data to KV store
    await fetch(`${process.env.NEXT_PUBLIC_KV_REST_API_URL}/set/${randomKey}`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_KV_REST_API_TOKEN}`,
        },
        body: JSON.stringify({
            imgURL: imgURL,
            walletAddress: walletAddress,
            type: type
        }),
        method: 'POST',
    })

    return randomKey;
}


export async function generateBlink(text: string, walletAddress: PublicKey | null, type: "truth" | "dare") {
    /**
     * This function will generate a blink image from the text
     * 
     * @param text - The text to generate the blink image from
     * @returns The blink image URL
     */

    const bgImgUrl = await generateTextImage(text);
    console.log(bgImgUrl);
    const randomKey = await saveImageAndWalletAddress(bgImgUrl, walletAddress, type);
    console.log(randomKey);

    const blinkLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/actions/tip/${randomKey}`;
    console.log(blinkLink);
    return blinkLink;
}







