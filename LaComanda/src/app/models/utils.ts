export class Utils {
  static validEmail(str: string ): boolean {

    if(str === undefined) {
      return false;
    }

    return str.includes('@') && str.indexOf('.') > -1;
  }

  static isEmpty(str: string): boolean {
    return str === undefined || str === ''; 
  }

  static samePassword(str1: string, str2: string): boolean {
    return str1 === str2;
  }

  static getDirectory(fullPath: string): string {
    return fullPath.substr(0, fullPath.lastIndexOf('/') + 1);
  }

  static getFilename(fullPath: string): string {
    return fullPath.substr(fullPath.lastIndexOf('/') + 1);
  }

  static getFilenameGallery(fullPath: string): string {
    const path = fullPath.split('?')[0];
    return path.substr(path.lastIndexOf('/') + 1);
  }

  static base64UrlToBlob(b64Data, contentType='', sliceSize=512): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}