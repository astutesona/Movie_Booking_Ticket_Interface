// ==========================================
// 1. MOVIE DATABASE (With Trailer Embeds)
// ==========================================
const movies = [
  {
    id: 1,
    title: "Cyber Neon 2088",
    genre: "Sci-Fi",
    language: "English",
    rating: 8.8,
    price: 18,
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80",
    cast: "Keanu R., Zoey D.",
    synopsis: "In a futuristic dystopian metropolis, a rogue hacker unravels a high-stakes conspiracy that threatens humanity.",
    trailer: "https://www.youtube.com/embed/d96cjJhvlMA?autoplay=1"
  },
  {
    id: 2,
    title: "Shadows of the Past",
    genre: "Drama",
    language: "Hindi",
    rating: 8.2,
    price: 14,
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80",
    cast: "Ranbir K., Alia B.",
    synopsis: "An emotional, gripping family drama centered on long-lost relatives reuniting under mysterious circumstances.",
    trailer: "https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1"
  },
  {
    id: 3,
    title: "The Golden Horizon",
    genre: "Action",
    language: "English",
    rating: 9.1,
    price: 22,
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80",
    cast: "Tom H., Zendaya C.",
    synopsis: "An action-packed globe-trotting adventure following legendary treasure hunters across uncharted ruins.",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  },
  {
    id: 4,
    title: "Realm of Magic",
    genre: "Animation",
    language: "Spanish",
    rating: 8.6,
    price: 12,
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=500&q=80",
    cast: "Gael G., Penélope C.",
    synopsis: "A heartwarming animated saga of a young sorceress embarking on a voyage to rescue her enchanted kingdom.",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  }
];

// ==========================================
// 2. GLOBAL STATE VARIABLES
// ==========================================
let activeMovie = null;
let selectedSeats = [];
let cart = [];
let bookingHistory = [];

// ==========================================
// 3. DOM ELEMENT REFERENCES
// ==========================================
const movieGrid = document.getElementById('movieGrid');
const filterGenre = document.getElementById('filterGenre');
const filterLanguage = document.getElementById('filterLanguage');
const filterRating = document.getElementById('filterRating');
const filterPrice = document.getElementById('filterPrice');
const priceValue = document.getElementById('priceValue');
const searchInput = document.getElementById('searchInput');

// Bootstrap Modals
const movieModalEl = document.getElementById('movieModal');
const movieModal = new bootstrap.Modal(movieModalEl);

const trailerModalEl = document.getElementById('trailerModal');
const trailerModal = new bootstrap.Modal(trailerModalEl);

const seatMap = document.getElementById('seatMap');
const addToCartBtn = document.getElementById('addToCartBtn');

// ==========================================
// 4. INITIALIZATION & LOCALSTORAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  renderMovies(movies);
  setupFilters();
  setupActiveNavHighlight();
  setupModalEventListeners();

  // Load saved bookings from localStorage
  const savedBookings = localStorage.getItem('myBookings');
  if (savedBookings) {
    try {
      bookingHistory = JSON.parse(savedBookings);
      renderBookingHistory();
    } catch (e) {
      console.error('Failed to parse saved bookings:', e);
    }
  }
});

// Setup Modals Event Listeners (Audio Stop & Showtime Change)
function setupModalEventListeners() {
  // Fix 1: Stop trailer audio whenever trailer modal closes (backdrop click, ESC, or close button)
  trailerModalEl.addEventListener('hidden.bs.modal', () => {
    document.getElementById('trailerIframe').src = '';
  });

  // Fix 3: Reset selected seats when switching showtime radio buttons
  document.querySelectorAll('input[name="timeRadio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      selectedSeats = [];
      document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
      });
    });
  });
}

// ==========================================
// 5. RENDER & FILTER MOVIES
// ==========================================
function renderMovies(movieList) {
  movieGrid.innerHTML = '';
  if (movieList.length === 0) {
    movieGrid.innerHTML = `
      <div class="col-12 text-center text-muted my-5">
        <i class="bi bi-film fs-1"></i>
        <h5 class="mt-2">No movies found matching your current filter criteria.</h5>
      </div>`;
    return;
  }

  movieList.forEach(movie => {
    const cardHtml = `
      <div class="col">
        <div class="card movie-card h-100 rounded-4 overflow-hidden">
          <div class="card-poster-wrapper">
            <img src="${movie.poster}" alt="${movie.title}">
            <button class="btn btn-danger btn-sm rounded-circle play-trailer-btn p-3 shadow" onclick="playTrailer('${movie.title}', '${movie.trailer}')">
              <i class="bi bi-play-fill fs-4"></i>
            </button>
            <span class="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-2 small fw-bold">$${movie.price}</span>
          </div>
          <div class="card-body d-flex flex-column justify-content-between p-3">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-secondary bg-opacity-50 text-light border border-secondary">${movie.genre}</span>
                <span class="text-warning small fw-bold"><i class="bi bi-star-fill"></i> ${movie.rating}</span>
              </div>
              <h5 class="card-title text-white fw-bold mb-1">${movie.title}</h5>
              <p class="text-muted small mb-3">${movie.language}</p>
            </div>
            <div class="d-grid gap-2">
              <button class="btn btn-outline-light btn-sm" onclick="playTrailer('${movie.title}', '${movie.trailer}')">
                <i class="bi bi-youtube text-danger"></i> Watch Trailer
              </button>
              <button class="btn btn-danger btn-sm fw-semibold" onclick="openBookingModal(${movie.id})">
                <i class="bi bi-ticket-perforated"></i> Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    movieGrid.innerHTML += cardHtml;
  });
}

function setupFilters() {
  const applyFilters = () => {
    const genre = filterGenre.value;
    const lang = filterLanguage.value;
    const minRating = parseFloat(filterRating.value);
    const maxPrice = parseFloat(filterPrice.value);
    const searchQuery = searchInput.value.toLowerCase().trim();

    priceValue.textContent = `$${maxPrice}`;

    const filtered = movies.filter(m => {
      const matchGenre = genre === 'all' || m.genre === genre;
      const matchLang = lang === 'all' || m.language === lang;
      const matchRating = m.rating >= minRating;
      const matchPrice = m.price <= maxPrice;
      const matchSearch = m.title.toLowerCase().includes(searchQuery);

      return matchGenre && matchLang && matchRating && matchPrice && matchSearch;
    });

    renderMovies(filtered);
  };

  filterGenre.addEventListener('change', applyFilters);
  filterLanguage.addEventListener('change', applyFilters);
  filterRating.addEventListener('change', applyFilters);
  filterPrice.addEventListener('input', applyFilters);
  searchInput.addEventListener('input', applyFilters);
}

// ==========================================
// 6. TRAILER PLAYER CONTROLS
// ==========================================
function playTrailer(title, embedUrl) {
  document.getElementById('trailerTitle').textContent = `${title} - Official Trailer`;
  document.getElementById('trailerIframe').src = embedUrl;
  trailerModal.show();
}

// ==========================================
// 7. BOOKING MODAL & SEAT MATRIX
// ==========================================
function openBookingModal(movieId) {
  activeMovie = movies.find(m => m.id === movieId);
  selectedSeats = [];

  // Reset timing selection to default (first option)
  document.getElementById('t1').checked = true;

  document.getElementById('modalTitle').textContent = activeMovie.title;
  document.getElementById('modalPoster').src = activeMovie.poster;
  document.getElementById('modalGenre').textContent = activeMovie.genre;
  document.getElementById('modalLanguage').textContent = activeMovie.language;
  document.getElementById('modalRating').textContent = activeMovie.rating;
  document.getElementById('modalCast').textContent = activeMovie.cast;
  document.getElementById('modalSynopsis').textContent = activeMovie.synopsis;

  // Construct Seat Map Grid
  seatMap.innerHTML = '';
  const rows = ['A', 'B', 'C', 'D'];
  rows.forEach(row => {
    for (let i = 1; i <= 6; i++) {
      const seatId = `${row}${i}`;
      const isOccupied = (movieId + i) % 4 === 0; 
      const seatEl = document.createElement('div');
      seatEl.className = `seat ${isOccupied ? 'occupied' : ''}`;
      seatEl.textContent = seatId;

      if (!isOccupied) {
        seatEl.addEventListener('click', () => toggleSeat(seatEl, seatId));
      }
      seatMap.appendChild(seatEl);
    }
  });

  movieModal.show();
}

function toggleSeat(seatEl, seatId) {
  if (selectedSeats.includes(seatId)) {
    selectedSeats = selectedSeats.filter(s => s !== seatId);
    seatEl.classList.remove('selected');
  } else {
    selectedSeats.push(seatId);
    seatEl.classList.add('selected');
  }
}

// ==========================================
// 8. CART & CHECKOUT WITH LOCALSTORAGE
// ==========================================
addToCartBtn.addEventListener('click', () => {
  if (selectedSeats.length === 0) {
    alert('Please pick at least one seat before proceeding!');
    return;
  }

  const selectedTime = document.querySelector('input[name="timeRadio"]:checked + label').textContent;
  const cartItem = {
    movieId: activeMovie.id,
    title: activeMovie.title,
    price: activeMovie.price,
    seats: [...selectedSeats],
    time: selectedTime,
    total: activeMovie.price * selectedSeats.length
  };

  cart.push(cartItem);
  updateCartUI();
  movieModal.hide();
});

function updateCartUI() {
  const cartList = document.getElementById('cartItemsList');
  const cartBadge = document.getElementById('cartCountBadge');
  cartList.innerHTML = '';

  let subtotal = 0;
  let ticketCount = 0;

  if (cart.length === 0) {
    cartList.innerHTML = `<p class="text-muted text-center my-5">Your cart is empty.</p>`;
  } else {
    cart.forEach((item, idx) => {
      subtotal += item.total;
      ticketCount += item.seats.length;

      cartList.innerHTML += `
        <div class="card bg-secondary bg-opacity-25 border-secondary mb-3 p-3 rounded-3">
          <div class="d-flex justify-content-between align-items-start">
            <h6 class="fw-bold text-white mb-1">${item.title}</h6>
            <button class="btn btn-sm text-danger p-0" onclick="removeCartItem(${idx})"><i class="bi bi-trash"></i></button>
          </div>
          <p class="small text-muted mb-1"><i class="bi bi-clock"></i> Show: ${item.time}</p>
          <p class="small text-muted mb-2"><i class="bi bi-grid-3x3-gap"></i> Seats (${item.seats.length}): <span class="text-danger fw-bold">${item.seats.join(', ')}</span></p>
          <div class="text-end fw-bold text-white">$${item.total.toFixed(2)}</div>
        </div>
      `;
    });
  }

  const fee = subtotal * 0.10; // 10% booking fee
  const total = subtotal + fee;

  cartBadge.textContent = ticketCount;
  document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('cartFee').textContent = `$${fee.toFixed(2)}`;
  document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

function removeCartItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function processCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Push cart items into history
  bookingHistory.push(...cart);
  cart = [];

  // Fix 2: Save updated bookings list into browser storage
  localStorage.setItem('myBookings', JSON.stringify(bookingHistory));

  updateCartUI();
  renderBookingHistory();

  alert('🎉 Booking Confirmed! Your tickets have been saved.');
  
  const offcanvasEl = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
  if (offcanvasEl) offcanvasEl.hide();
}

function renderBookingHistory() {
  const container = document.getElementById('bookingHistoryContainer');
  container.innerHTML = '';

  if (bookingHistory.length === 0) {
    container.innerHTML = `<p class="text-muted text-center mb-0">No past bookings found.</p>`;
    return;
  }

  bookingHistory.forEach((item, i) => {
    container.innerHTML += `
      <div class="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-3 mb-3">
        <div>
          <h6 class="fw-bold text-white mb-1">Ticket #${1000 + i} - ${item.title}</h6>
          <span class="small text-muted">Seats: ${item.seats.join(', ')} | Timing: ${item.time}</span>
        </div>
        <span class="badge bg-success">Confirmed</span>
      </div>
    `;
  });
}

// ==========================================
// 9. NAVBAR ACTIVE STATE ON SCROLL
// ==========================================
function setupActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.navbar-nav a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
}