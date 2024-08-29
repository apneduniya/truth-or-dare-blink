import {
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
    ActionError,
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
import { NextResponse, type NextRequest } from "next/server";


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
            `/api/actions/tip/${params.id}`,
            requestUrl.origin
        ).toString();
        console.log(baseHref);
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
                        href: `${baseHref}?amount={amount}&message={message}&rating={rating}`,
                        label: 'Tip', // button text
                        parameters: [
                            {
                                type: "radio",
                                name: "rating", // parameter name in the `href` above
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

        return NextResponse.json(payload, {
            headers: ACTIONS_CORS_HEADERS,
        });
    } catch (err) {

        console.log(err);
        let message = "An unknown error occurred";

        if (typeof err == "string") message = err;

        return new NextResponse(message, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }
}

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;

// for post the url is like this:
// http://localhost:3000/api/actions/tip/123?amount=0.1&message=Hello&rating=3

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const requestUrl = new URL(req.url);
        const { amount, message, rating } = validatedQueryParams(requestUrl);
        // Fetch the stored data for this tip
        const tipData = await getData(params.id);

        if (!tipData) {
            return NextResponse.json(
                { error: 'Tip data not found' },
                { status: 404, headers: ACTIONS_CORS_HEADERS }
            );
        }

        const toPubkey = new PublicKey(tipData.walletAddress);
        const body: ActionPostRequest = await req.json();

        // validate the client provided input
        let account: PublicKey;
        try {
            account = new PublicKey(body.account);
        } catch (err) {
            throw 'Invalid "account" provided';
        }

        const connection = new Connection(
            process.env.SOLANA_RPC! || clusterApiUrl("devnet"),
        );

        // ensure the receiving account will be rent exempt
        const minimumBalance = await connection.getMinimumBalanceForRentExemption(
            0, // note: simple accounts that just store native SOL have `0` bytes of data
        );
        if (amount * LAMPORTS_PER_SOL < minimumBalance) {
            throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
        }

        // create an instruction to transfer native SOL from one wallet to another
        const transferSolInstruction = SystemProgram.transfer({
            fromPubkey: account,
            toPubkey: toPubkey,
            lamports: amount * LAMPORTS_PER_SOL,
        });

        // get the latest blockhash amd block height
        const { blockhash, lastValidBlockHeight } =
            await connection.getLatestBlockhash();

        // create a legacy transaction
        const transaction = new Transaction({
            feePayer: account,
            blockhash,
            lastValidBlockHeight,
        }).add(transferSolInstruction);

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: `Rating: ${rating}/5. Message: ${message}.`,
            },
        });

        return NextResponse.json(payload, {
            headers: ACTIONS_CORS_HEADERS,
        });
    } catch (err) {
        console.error("Error in POST:", err);

        let message = "An unknown error occurred";
        if (err instanceof Error) {
            message = err.message;
        } else if (typeof err === "string") {
            message = err;
        }

        return NextResponse.json({ error: message }, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }
}

function validatedQueryParams(requestUrl: URL) {

    let message: string = "";
    let rating: string = "";
    let amount: number = 0;
    //   try {
    //     if (requestUrl.searchParams.get("to")) {
    //       toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
    //     }
    //   } catch (err) {
    //     throw "Invalid input query parameter: to";
    //   }

    try {
        if (requestUrl.searchParams.get("amount")) {
            amount = parseFloat(requestUrl.searchParams.get("amount")!);
        }

        if (amount <= 0) throw "amount is too small";
    } catch (err) {
        throw "Invalid input query parameter: amount";
    }

    try {
        if (requestUrl.searchParams.get("message")) {
            message = requestUrl.searchParams.get("message")!;
        }
    } catch (err) {
        throw "Invalid input query parameter: message";
    }

    try {
        if (requestUrl.searchParams.get("rating")) {
            rating = requestUrl.searchParams.get("rating")!;
        }
    } catch (err) {
        throw "Invalid input query parameter: rating";
    }

    return {
        amount,
        message,
        rating,
    };
}

