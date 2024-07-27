namespace FileHelper {

  /**
   * Extracts the file extension from a given file path.
   *
   * @param {string} filePath - The path of the file.
   * @returns {string} - The file extension (without the dot), or an empty string if no extension is found.
   *
   * Example:
   * getExtensionFromFile('path/to/file.txt')
   * // Returns: 'txt'
   */
  export function getFileExtension(filePath: string): string {
    const parts: string[] = filePath.split('.');
    if (parts.length > 1) {
      return parts.pop()!;
    }
    return '';
  }

}

export default FileHelper;
