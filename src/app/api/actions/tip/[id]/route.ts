import {
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
} from "@solana/actions";
import {
    clusterApiUrl,
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import type { NextRequest } from "next/server";


type UserData = {
    imgURL: string;
    walletAddress: string;
    type: "truth" | "dare";
}

async function getData(id: string): Promise<UserData | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_KV_REST_API_URL}/get/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_KV_REST_API_TOKEN}`,
            },
        });
        const data: UserData | null = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}


export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const requestUrl = new URL(req.url || "");
        const baseHref = new URL(
            `/api/actions/tip`,
            requestUrl.origin
        ).toString();
        const id = params.id;
        const data = await getData(id as string);

        const payload: ActionGetResponse = {
            title: "Truth or Dare",
            icon: data?.imgURL || "",
            description: data?.type === "truth" ? "What do you think weather he/she said the truth? If you liked it, tip him/her" : "What do you think weather he/she did the dare? If you liked it, tip him/her",
            label: "Tip",
            links: {
                actions: [
                    {
                        href: `${baseHref}?amount={amount}&message={message}`,
                        label: 'Tip', // button text
                        parameters: [
                            {
                                type: "radio",
                                name: "choice", // parameter name in the `href` above
                                label: "How much did you like it?", // placeholder of the text input
                                required: true,
                                options: [
                                    { label: "🙃 This wasn't for you", value: "1" },
                                    { label: "👉 👈 Okay type", value: "2" },
                                    { label: "💪 Solid", value: "3" },
                                    { label: "🔥 Impressive", value: "4" },
                                    { label: "🚀 Mooning", value: "5" },
                                ],
                            },
                            {
                                name: "amount",
                                label: 'Enter the amount of $SEND you want to tip',
                                required: true,
                            },
                            {
                                type: "textarea",
                                name: "message",
                                label: "Want to say something?",
                            },
                        ],
                    }
                ],
            },
        };

        return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS,
        });
    } catch (err) {

        console.log(err);
        let message = "An unknown error occurred";

        if (typeof err == "string") message = err;

        return new Response(message, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }
}


export const POST = async (req: Request) => {
    const body: ActionPostRequest = await req.json();

    // insert transaction logic here    

    // const payload: ActionPostResponse = await createPostResponse({
    //     fields: {
    // transaction,
    //         message: "Optional message to include with transaction",
    //     },
    // });

    const payload = {
        message: "Transaction successful",
    }

    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
    });
};

