export const readUploadedFileAsText = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputFile = event!.target!.files![0];
    const temporaryFileReader = new FileReader();

    return new Promise<any>((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
        };

        temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsDataURL(inputFile);
    });
};