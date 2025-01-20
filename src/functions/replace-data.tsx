export function replaceData(text: string, data: string[]) {
    let nText = text;
    data.forEach((val, i) => {
        nText = nText.replaceAll(`{${i + 1}}`, val);
    });

    return nText;
}
