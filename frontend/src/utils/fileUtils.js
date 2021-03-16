export const downloadFile = (fileString, fileExtension, fileName) => {
    const blob = new Blob(['\uFEFF', fileString], {
        type: 'text/csv;charset=utf-8',
    });
    const link = window.document.createElement('a');
    const url = window.URL.createObjectURL(blob);

    link.href = url;
    link.download = fileName || `${new Date().toLocaleDateString()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

export const getFileNameFromContentDisposition = (contentDisposition) => {
    let filename = '';

    if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
        }
    }

    return filename;
};
