"use client"

import { TruthAndDare } from "@/assets/data/truthAndDare";
import GetBlinkButton from "@/components/common/Button/GetBlink";
import RandomTruthOrDareButton from "@/components/common/Button/RandomTruthOrDare";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { generateBlink } from "@/utils/blink";
import getRandomTruthOrDare from "@/utils/truthAndDare";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";


export default function Home() {
  const [randomTruthOrDare, setRandomTruthOrDare] = useState<TruthAndDare>();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);

  const loadingStates = [
    {
      text: "Generating the image",
    },
    {
      text: "Saving it",
    },
    {
      text: "Generating the blink"
    },
    {
      text: "Copying to clipboard"
    }
  ];

  // Get random truth or dare on button click
  const handleRandomTruthOrDare = () => {
    // TODO: Add a loading state
    const newTruthOrDare = getRandomTruthOrDare();
    setRandomTruthOrDare(newTruthOrDare);
    console.log("New truth or dare:", newTruthOrDare); // Add this line for debugging
  }

  // Get blink on button click
  const handleGetBlink = async () => {
    if (!publicKey) {
      alert("Please connect your wallet to generate a blink");
      return;
    }

    // Generating the blink with loading states
    setLoading(true);
    const blinkLink = await generateBlink(randomTruthOrDare?.text || '', publicKey, randomTruthOrDare?.type || 'truth');
    setLoading(false);

    alert(`This is your blink: ${blinkLink}`);

    // copy to clipboard
    navigator.clipboard.writeText(blinkLink);
  }

  useEffect(() => {
    setRandomTruthOrDare(getRandomTruthOrDare());
  }, []);

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-[80dvh] w-full">
        <Loader loadingStates={loadingStates} loading={loading} duration={2000} loop={false} />
        <div className="w-10/12 mx-auto flex flex-col justify-center items-center gap-20">
          <TextGenerateEffect words={randomTruthOrDare?.text || ''} className="text-white" key={randomTruthOrDare?.text} />
          <div className="flex lg:gap-80 md:gap-40 gap-20 sm:flex-row flex-col">
            <RandomTruthOrDareButton onClick={handleRandomTruthOrDare} />
            {
              publicKey ? <GetBlinkButton onClick={handleGetBlink} /> : <GetBlinkButton onClick={() => { }} disabled />
            }
          </div>
        </div>
      </main>
    </>
  );
}
