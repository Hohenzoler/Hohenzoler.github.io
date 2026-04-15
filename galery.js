const images = [
    "img/optyka1.png",
    "img/optyka2.png",
    "img/optyka3.png",
    "img/dm1.png",
    "img/dm2.png",
    "img/dm3.png",
    "img/pr1.png",
    "img/pr2.png",
    "img/pr3.png",
    "img/pr4.png",
    "img/pr5.png",
    "img/pr6.png",
    "img/rb1.png",
    "img/rb2.png",
    "img/rb3.png",
    "img/rb4.png"
  ];

  let currentIndex = 0;

  const mainImage = document.getElementById("mainImage");
  const thumbnailsContainer = document.getElementById("thumbnails");

  function renderThumbnails() {
    thumbnailsContainer.innerHTML = "";
    images.forEach((img, index) => {
      const thumb = document.createElement("img");
      thumb.src = img;
      if (index === currentIndex) thumb.classList.add("active");

      thumb.addEventListener("click", () => {
        currentIndex = index;
        updateGallery();
      });

      thumbnailsContainer.appendChild(thumb);
    });
  }

  function updateGallery() {
    mainImage.src = images[currentIndex];
    renderThumbnails();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateGallery();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateGallery();
  }

  // Initialize
  updateGallery();