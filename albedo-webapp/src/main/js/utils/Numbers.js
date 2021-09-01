var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

export function formatMemorySize(bytes) {
    if (bytes == 0) return '0 Bytes';
    if (bytes === undefined) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
 }