import { uploadImageToImgBB } from "./saveImg";




async function getTextImage(text: string) {
    /**
     * This function generates an image with text over a background image
     * @param text - The text to be displayed on the image
     * @returns The base64 encoded image
     */

    const bgImage = 'https://i.ibb.co/4tS7WGH/pngtree-clean-top-view-of-white-crumpled-paper-texture-background-image-13653623.png';
    const textColor = '2658ddff';
    const textSize = '32';
    const margin = '';
    const yAlign = 'middle';
    const xAlign = 'center';
    const imgText = encodeURIComponent(text);

    const url = `https://textoverimage.moesif.com/image?image_url=${bgImage}&text=${imgText}&text_color=${textColor}&text_size=${textSize}&margin=${margin}&y_align=${yAlign}&x_align=${xAlign}`;

    // get base64 image of the text over image
    const base64Image = await fetch(url).then(res => res.blob());

    return base64Image
}

async function getTextImageUsingCanvas(text: string): Promise<Blob> {
    /**
     * This function generates an image with text over a background image using canvas
     * @param text - The text to be displayed on the image
     * @returns The Blob of the generated image
     */

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Unable to get 2D context');
    }

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Load and draw background image
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous'; // Add this line to allow cross-origin image loading
    bgImage.src = 'https://i.ibb.co/4tS7WGH/pngtree-clean-top-view-of-white-crumpled-paper-texture-background-image-13653623.png';

    const WORD_LIMIT = 7; // Number of words per line

    return new Promise((resolve, reject) => {
        bgImage.onload = () => {
            try {
                ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

                // Set text properties for main text
                ctx.fillStyle = '#2658dd';
                ctx.font = 'bold 32px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Draw main text with line breaks
                const words = text.split(' ');
                let lines = [];
                let currentLine = '';
                for (let i = 0; i < words.length; i++) {
                    if (currentLine.split(' ').length === WORD_LIMIT || i === words.length - 1) {
                        lines.push((currentLine + ' ' + words[i]).trim());
                        currentLine = '';
                    } else {
                        currentLine += words[i] + ' ';
                    }
                }

                const lineHeight = 40;
                const startY = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;
                lines.forEach((line, index) => {
                    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
                });

                // Add watermark in top-left
                ctx.fillStyle = 'rgba(38, 88, 221, 0.5)'; // Semi-transparent blue
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText('Truth & Dare', 20, 20);

                // Add watermark in bottom-right
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText('By @thatsmeadarsh', canvas.width - 20, canvas.height - 20);

                // Convert canvas to blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob from canvas'));
                    }
                }, 'image/png');
            } catch (error) {
                reject(error);
            }
        };

        bgImage.onerror = () => {
            reject(new Error('Failed to load background image'));
        };
    });
}



export async function generateTextImage(text: string) {
    /**
     * This function generates an image with text over a background image and returns the URL of the uploaded image
     * @param text - The text to be displayed on the image
     * @returns The URL of the uploaded image
     */

    // const base64Image = await getTextImage(text);
    const base64Image = await getTextImageUsingCanvas(text);
    const imgBBResponse = await uploadImageToImgBB(base64Image);
    return imgBBResponse.data.display_url
}

