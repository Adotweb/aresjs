const mimeMap = new Map([
    ['.txt', 'text/plain'],
    ['.html', 'text/html'],
    ['.htm', 'text/html'],
    ['.css', 'text/css'],
    ['.js', 'application/javascript'],
    ['.json', 'application/json'],
    ['.xml', 'application/xml'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.png', 'image/png'],
    ['.gif', 'image/gif'],
    ['.svg', 'image/svg+xml'],
    ['.bmp', 'image/bmp'],
    ['.webp', 'image/webp'],
    ['.mp3', 'audio/mpeg'],
    ['.wav', 'audio/wav'],
    ['.ogg', 'audio/ogg'],
    ['.mp4', 'video/mp4'],
    ['.avi', 'video/x-msvideo'],
    ['.mpeg', 'video/mpeg'],
    ['.webm', 'video/webm'],
    ['.mov', 'video/quicktime'],
    ['.pdf', 'application/pdf'],
    ['.doc', 'application/msword'],
    ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['.xls', 'application/vnd.ms-excel'],
    ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['.ppt', 'application/vnd.ms-powerpoint'],
    ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    ['.zip', 'application/zip'],
    ['.rar', 'application/x-rar-compressed'],
    ['.7z', 'application/x-7z-compressed'],
    ['.tar', 'application/x-tar'],
    ['.gz', 'application/gzip'],
    ['.csv', 'text/csv']
]);

const textbased = [
  "txt",
  "json",
  "js",
  "html",
  "css",
  "xml",
  "csv",
  "svg",
  "md",
  "yaml",
  "yml"
];

module.exports = {
	mimeMap,
	textbased
}
