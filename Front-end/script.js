const form = document.getElementById('resizeForm');
const imageInput = document.getElementById('imageInput');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const resizedImageDiv = document.getElementById('resizedImage');
const gallery = document.getElementById('gallery');

let selectedFile = null;

// Resize and upload image
async function resizeImage(file, width, height) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('width', width);
  formData.append('height', height);

  try {
    const response = await fetch('http://localhost:3000/api/images/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Resize failed');
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    displayResizedImage(imageUrl);
    addToGallery(imageUrl, file);
  } catch (error) {
    console.error(error);
    alert('Error resizing image.');
  }
}

function displayResizedImage(imageUrl) {
  resizedImageDiv.innerHTML = `<img src="${imageUrl}" alt="Resized Image" />`;
}

function addToGallery(imageUrl, file) {
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'Resized Image';
  img.classList.add('gallery-image');

  // Store the file as a property on the DOM element
  img.dataset.fileName = file.name;
  img._file = file;

  img.addEventListener('click', () => {
    document
      .querySelectorAll('#gallery .gallery-image')
      .forEach(image => image.classList.remove('selected'));

    img.classList.add('selected');
    selectedFile = img._file;
    displayResizedImage(img.src);
  });

  gallery.appendChild(img);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const width = widthInput.value;
  const height = heightInput.value;

  const file = imageInput.files[0];

  if (selectedFile) {
    resizeImage(selectedFile, width, height);
  } else if (file) {
    resizeImage(file, width, height);
  } else {
    alert('Please select or upload an image first.');
  }
});
