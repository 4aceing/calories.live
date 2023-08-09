export function fileToBase64(file: File) {
  return new Promise<string>((resolve) => {
    if (!file) resolve('');

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = () => resolve('');
  });
}

export function resizeImage(file: File, width: number, height: number) {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = () => {
    const img = document.createElement('img');
    img.src = fileReader.result as string;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL(file.type);
      console.log(dataUrl);
    };
  };
}
