



export async function uploadImageToImgBB(base64Image: Blob) {
    /**
     * This function uploads an image to ImgBB and returns the URL of the uploaded image
     * @param base64Image - The base64 encoded image
     * @returns The URL of the uploaded image
     */

    const url = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`;
    const formData = new FormData();
    formData.append("image", base64Image);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}
