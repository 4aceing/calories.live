export function fileToBase64(file: File) {
  return new Promise<string>((resolve) => {
    if (!file) resolve('');

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = () => resolve('');
  });
}

export function resizeBase64Image(base64: string, width: number, height: number) {
  return new Promise<string>((resolve) => {
    const img = document.createElement('img');
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;

      canvas.width = width;
      canvas.height = height;

      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL());
    };

    img.onerror = () => resolve('');
  });
}

export async function imageUrlToBase64(url: string) {
  const response = await fetch(url);

  const blob = await response.blob();
  
  return await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(blob);
  });
}
