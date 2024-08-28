import { generateTextImage } from "./textOverImage";



export async function generateBlink(text: string) {
    /**
     * This function will generate a blink image from the text
     * 
     * @param text - The text to generate the blink image from
     * @returns The blink image URL
     */

    const bgImgUrl = await generateTextImage(text);
    return bgImgUrl;
}







