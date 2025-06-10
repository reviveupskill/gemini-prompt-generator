const textInput = document.getElementById('textInput');
const imageInput = document.getElementById('imageInput');
const generateBtn = document.getElementById('generateBtn');
const outputBox = document.getElementById('outputBox');
const copyOutputBtn = document.getElementById('copyOutputBtn');
const deleteInputBtn = document.getElementById('deleteInputBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorDisplay = document.getElementById('errorDisplay');

async function generatePrompt() {
    const text = textInput.value.trim();
    const imageFile = imageInput.files.length > 0 ? imageInput.files [0] : null;

    if (!text && !imageFile) {
        outputBox.textContent = 'Please enter text or upload an image.';
        return;
    }

    loadingIndicator.style.display = 'block';
    outputBox.textContent = '';
    errorDisplay.style.display = 'none';

    const formData = new FormData();
    formData.append('text', text);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch('/api/generate', { // Vercel API endpoint
            method: 'POST',
            body: formData, // Send as multipart/form-data
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate prompt.');
        }

        const data = await response.json();
        outputBox.textContent = data.generatedText;

    } catch (error) {
        console.error('Error generating prompt:', error);
        errorDisplay.textContent = `Error: ${error.message}`;
        errorDisplay.style.display = 'block';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

generateBtn.addEventListener('click', generatePrompt);

copyOutputBtn.addEventListener('click', () => {
    const textToCopy = outputBox.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Prompt copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text.');
    });
});

deleteInputBtn.addEventListener('click', () => {
    textInput.value = '';
    imageInput.value = ''; // Clear file input
    outputBox.textContent = '';
});

textInput.addEventListener('input', () => {
    if (textInput.value.trim() === '' && imageInput.files.length === 0) {
        outputBox.textContent = '';
    }
});


imageInput.addEventListener('change', () => {
    if (textInput.value.trim() === '' && imageInput.files.length === 0) {
        outputBox.textContent = '';
    }
});
