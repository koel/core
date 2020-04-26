const fileReader = {
  /**
   * Read a File into a binary string
   * @param {File} file
   */
  readAsDataUrl: file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export { fileReader }
