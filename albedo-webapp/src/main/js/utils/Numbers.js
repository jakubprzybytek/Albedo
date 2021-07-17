var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

export function formatMemorySize(bytes) {
    if (bytes == 0) return '0 Byte';
    if (bytes === undefined) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }