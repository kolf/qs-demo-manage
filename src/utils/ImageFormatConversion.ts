//file转bse64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      resolve(e.target.result)
    }
  })

}

// blob转file
export function blobToFile(blob, fileName) {
  blob.lastModifiedDate = new Date();
  blob.name = fileName;
  return blob;
};

//blob转base64
export function blobToBase64(blob, callback) {
  let reader = new FileReader();
  reader.onload = function (e) { callback(e.target.result); }
  reader.readAsDataURL(blob);
}