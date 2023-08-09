export function fileToBase64(file: File) {
  return new Promise<string>((resolve) => {
    if (!file) resolve('');

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = () => resolve('');
  });
}

export function imageToBase64AndResize(file: File, width: number, height: number) {
  return new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      const img = document.createElement('img');
      img.src = fileReader.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;

        context.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(file.type);
        resolve(dataUrl);
      };

      img.onerror = () => resolve('');
    };

    fileReader.onerror = () => resolve('');
  });
}
