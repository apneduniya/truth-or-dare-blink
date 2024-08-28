"use client"

import { TruthAndDare } from "@/assets/data/truthAndDare";
import GetBlinkButton from "@/components/common/Button/GetBlink";
import RandomTruthOrDareButton from "@/components/common/Button/RandomTruthOrDare";
import { generateBlink } from "@/utils/blink";
import getRandomTruthOrDare from "@/utils/truthAndDare";
import { useEffect, useState } from "react";


export default function Home() {
  const [randomTruthOrDare, setRandomTruthOrDare] = useState<TruthAndDare>();

  // Get random truth or dare on button click
  const handleRandomTruthOrDare = () => {
    // TODO: Add a loading state
    setRandomTruthOrDare(getRandomTruthOrDare());
  }

  // Get blink on button click
  const handleGetBlink = async () => {
    const bgImgUrl = await generateBlink(randomTruthOrDare?.text || '');
    alert(bgImgUrl);

    // copy to clipboard
    navigator.clipboard.writeText(bgImgUrl);
  }

  useEffect(() => {
    setRandomTruthOrDare(getRandomTruthOrDare());
  }, []);

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-[80dvh] w-full">
        <div className="w-10/12 mx-auto flex flex-col justify-center items-center gap-20">
          <p className="text-2xl">{randomTruthOrDare?.text}</p>
          <div className="flex lg:gap-80 md:gap-40 gap-20 sm:flex-row flex-col">
            <RandomTruthOrDareButton onClick={handleRandomTruthOrDare} />
            <GetBlinkButton onClick={handleGetBlink} />
          </div>
        </div>
      </main>
    </>
  );
}
