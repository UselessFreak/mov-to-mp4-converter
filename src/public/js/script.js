const form = document.getElementById('uploadForm');
const fileStatus = document.querySelector('.file-status');
const fileInput = document.getElementById('fileInput');
const convertButton = document.getElementById('convertButton');
const downloadButton = document.getElementById('downloadButton');
const progressContainer = document.querySelector('.progress-container');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');
const loader = document.querySelector('.loader');
let downloadUrl = '';
let fileSelected = false;

function randomRange(min, max) {
    return (min + ((max - min) * Math.random())).toFixed(4);
}

function createHexGrid() {
    const container = document.querySelector('.hex-container');
    const hexSize = 50;
    const rows = Math.ceil(window.innerHeight / (hexSize * 1.5));
    const cols = Math.ceil(window.innerWidth / (hexSize * 1.7));

    container.innerHTML = '';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const hex = document.createElement('div');
            hex.className = 'hexagon';
            
            for (let i = 0; i < 6; i++) {
                const line = document.createElement('div');
                line.className = 'hexagon-line';
                hex.appendChild(line);
            }

            hex.style.left = `${col * hexSize * 1.7}px`;
            hex.style.top = `${row * hexSize * 1.5 + (col % 2) * (hexSize * 0.75)}px`;
            container.appendChild(hex);
        }
    }
}

document.addEventListener('DOMContentLoaded', createHexGrid);
window.addEventListener('resize', createHexGrid);

document.body.addEventListener("click", (e) => {
    const sparkCount = 12;
    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement("div");
        spark.className = "spark";
        document.body.appendChild(spark);

        const angle = (i * 360) / sparkCount;
        const dx = 50 * Math.cos((angle * Math.PI) / 180);
        const dy = 50 * Math.sin((angle * Math.PI) / 180);
        spark.style.setProperty("--dx", `${dx}px`);
        spark.style.setProperty("--dy", `${dy}px`);

        spark.style.left = `${e.pageX}px`;
        spark.style.top = `${e.pageY}px`;

        spark.addEventListener("animationend", () => spark.remove());
    }
});

function handleFileChange(e) {
    const file = e.target.files[0];
    const maxSize = 1024 * 1024 * 1024;

    if (file && file.size > maxSize) {
        fileStatus.textContent = 'File is too large. Maximum size is 1GB';
        convertButton.disabled = true;
        fileSelected = false;
        return;
    }

    if (file) {
        fileSelected = true;
        fileStatus.textContent = `Selected file: ${file.name}`;
        fileInput.parentElement.firstChild.textContent = 'Change File';
        convertButton.style.display = 'block';
        downloadButton.style.display = 'none';
        convertButton.textContent = 'Convert Video';
    } else {
        fileSelected = false;
        fileStatus.textContent = 'No file selected';
        fileInput.parentElement.firstChild.textContent = 'Select MOV File';
        downloadButton.style.display = 'none';
        convertButton.style.display = 'block';
        convertButton.textContent = 'Convert Video';
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    if (!fileSelected) {
        fileStatus.textContent = 'Please select a file first';
        return;
    }

    const formData = new FormData();
    formData.append('video', fileInput.files[0]);

    try {
        convertButton.style.display = 'none';
        loader.style.display = 'flex';
        fileStatus.textContent = 'Converting video...';
        convertButton.disabled = true;

        const eventSource = new EventSource('/api/progress');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.percent === 100) {
                eventSource.close();
            }
        };

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            fileStatus.textContent = 'Conversion completed successfully!';
            loader.style.display = 'none';
            downloadUrl = data.downloadUrl;
            downloadButton.style.display = 'block';
            convertButton.disabled = false;
        } else {
            fileStatus.textContent = `Error: ${data.error}`;
            convertButton.style.display = 'block';
            loader.style.display = 'none';
            convertButton.disabled = false;
            eventSource.close();
        }
    } catch (error) {
        fileStatus.textContent = `Error: ${error.message}`;
        convertButton.style.display = 'block';
        loader.style.display = 'none';
        convertButton.disabled = false;
        eventSource.close();
    }
}

function handleDownload() {
    if (downloadUrl) {
        window.location.href = downloadUrl;
        downloadButton.style.display = 'none';
        convertButton.style.display = 'block';
        convertButton.textContent = 'Convert Video';
        fileStatus.textContent = 'No file selected';
        fileSelected = false;
        fileInput.parentElement.firstChild.textContent = 'Select MOV File';
        fileInput.value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');

    fileInput.addEventListener('change', handleFileChange);
    form.addEventListener('submit', handleFormSubmit);
    downloadButton.addEventListener('click', handleDownload);

    setTimeout(() => {
        document.querySelectorAll('.hexagon-line').forEach(line => {
            line.style.animationPlayState = 'running';
        });
    }, 100);
});

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    document.querySelectorAll('.hexagon').forEach(hex => {
        const rect = hex.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = Math.abs(e.clientX - centerX) / window.innerWidth;
        const distanceY = Math.abs(e.clientY - centerY) / window.innerHeight;

        const intensity = 1 - Math.min(distanceX + distanceY, 1);
        const moveX = (mouseX - 0.5) * 15 * intensity;
        const moveY = (mouseY - 0.5) * 15 * intensity;

        hex.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
})