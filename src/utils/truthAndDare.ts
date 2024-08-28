import { truthAndDare } from "@/assets/data/truthAndDare";
import type { TruthAndDare } from "@/assets/data/truthAndDare";


export default function getRandomTruthOrDare(): TruthAndDare {
    /**
     * This function will return a random truth or dare from the truthAndDare array.
     * 
     * @param truthAndDare - The array of truth and dare prompts.
     * @returns A random truth or dare prompt.
     */

    const randomIndex = Math.floor(Math.random() * truthAndDare.length);
    return truthAndDare[randomIndex];
}

