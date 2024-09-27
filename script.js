const apiKey = '46220530-8ee28f6198d80d4b9c8f84705'; 
const apiUrl = `https://pixabay.com/api/?key=${apiKey}&per_page=12`;

const imageGrid = document.getElementById('imageGrid');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const viewFavoritesBtn = document.getElementById('viewFavoritesBtn');


const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalInfo = document.getElementById('modalInfo');
const closeModal = document.getElementById('closeModal');
const favoriteBtn = document.getElementById('favoriteBtn');
const shareBtn = document.getElementById('shareBtn');
const downloadBtn = document.getElementById('downloadBtn');


async function fetchImages(query = '') {
  try {
    const response = await fetch(`${apiUrl}&q=${query}`);
    const data = await response.json();
    displayImages(data.hits);
  } catch (error) {
    alert('Error fetching images. Please try again later.');
    console.error(error);
  }
}


function displayImages(images) {
  imageGrid.innerHTML = '';
  images.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = image.previewURL;
    imgElement.alt = image.tags;
    imgElement.addEventListener('click', () => openModal(image));
    imageGrid.appendChild(imgElement);
  });
}


function openModal(image) {
  modalImage.src = image.largeImageURL;
  modalInfo.textContent = `Author: ${image.user}`;
  downloadBtn.onclick = () => downloadImage(image.largeImageURL);
  
 
  favoriteBtn.onclick = () => addToFavorites(image);
  
  
  shareBtn.onclick = () => shareImage(image);
  
  imageModal.style.display = 'flex';
}

closeModal.onclick = () => {
  imageModal.style.display = 'none';
};

function downloadImage(url) {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pixabay-image.jpg';
  link.click();
}


function addToFavorites(image) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  if (!favorites.some(fav => fav.id === image.id)) {
    favorites.push(image);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Image added to favorites!');
  } else {
    alert('Image is already in favorites.');
  }
}

function shareImage(image) {
  if (navigator.share) {
    navigator.share({
      title: 'Check out this image from Pixabay!',
      text: `Photo by ${image.user} on Pixabay`,
      url: image.pageURL
    }).catch(error => console.error('Error sharing:', error));
  } else {
    alert('Web Share API is not supported in your browser.');
  }
}

searchBtn.addEventListener('click', () => {
  const query = searchInput.value;
  fetchImages(query);
});


viewFavoritesBtn.addEventListener('click', () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.length === 0) {
    alert('No favorites added yet.');
    return;
  }
  
 
  displayImages(favorites);
});


fetchImages();
