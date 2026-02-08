
const uploadFile = async (file) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Mocking file upload for:", file.name);
            resolve({
                fileUrl: `https://mock-storage.com/${file.name}-${Date.now()}.pdf`
            });
        }, 1500);
    });
};

export default {
    uploadFile
};
