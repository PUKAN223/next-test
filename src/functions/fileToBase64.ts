export default function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function () {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}