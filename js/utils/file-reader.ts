const fileReader = {
  /**
   * Read a File into a binary string
   */
  readAsDataUrl: (file: Blob) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

export { fileReader }
