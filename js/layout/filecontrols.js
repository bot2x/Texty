
function FileController(numFiles) {
    let nFiles = numFiles;

    function addFile() {
        nFiles += 1;
    }

    function totalFiles () {
        return nFiles;
    }

    return {
        addFile,
        totalFiles,
    };
}