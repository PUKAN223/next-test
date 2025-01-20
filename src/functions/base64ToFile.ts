export default function base64ToFile(base64: string, filename: string, mimeType: string): File {
    const base64String = base64.split(',')[1];
    const binaryString = atob(base64String);
    const byteArray = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: mimeType })
    const file = new File([blob], filename, { type: mimeType });

    return file;
}