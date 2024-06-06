const constraints = {
    video: true
};

const video = document.getElementById('localVideo');

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error('Error accessing media devices.', error);
    });

window.addEventListener('beforeunload', () => {
    const formData = new FormData();
    formData.append('video', video.srcObject);

    fetch('/video/upload', {
        method: 'POST',
        body: formData
    }).then((response) => {
        if (!response.ok) {
            console.error('File upload failed.');
        }
    });
});
