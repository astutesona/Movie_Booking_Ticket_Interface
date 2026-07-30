# 🎬 CinePass - Movie Ticket Booking Web Interface

A modern, responsive, and feature-rich Movie Ticket Booking web application built with **HTML5, CSS3, Bootstrap 5, and JavaScript (ES6)**. Designed with a dark-themed aesthetic, CinePass delivers a smooth cinema ticket reservation experience complete with live filtering, embedded trailers, interactive seat maps, and persistent booking management.

---

## 🌟 Key Features

* **📱 Modern & Fully Responsive UI:** Built using Bootstrap 5 grid layout and custom styling to ensure seamless compatibility across mobile devices, tablets, and desktops.
* **🧭 Interactive Navigation:** Smooth-scrolling navbar linking directly to *Movies, Theatres, Offers, My Bookings,* and *Contact* sections with active scroll-highlighting.
* **🎠 Promotional Hero Carousel:** Dynamic hero slides highlighting weekend discounts, IMAX announcements, and combo deals.
* **⚡ Multi-Criteria Filtering & Live Search:** Instantly filter movie listings by **Genre**, **Language**, **Minimum Rating**, **Price Range**, or **Title Search** without reloading the page.
* **🎬 Movie Details & Trailer Player:** Embedded YouTube trailer modal that automatically stops video/audio playback upon closing.
* **🪑 Interactive Seat Selector:** Visual seat matrix (Available, Selected, and Occupied states) that automatically clears selections when switching showtimes.
* **🛒 Dynamic Cart & Bill Generation:** Offcanvas drawer calculating ticket subtotals, a 10% processing fee, and real-time total payable amounts.
* **💾 LocalStorage Persistence:** Confirmed bookings are saved in the browser's local storage so ticket history remains intact even after refreshing the page.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Framework & UI Kit:** [Bootstrap 5.3](https://getbootstrap.com/) & [Bootstrap Icons](https://icons.getbootstrap.com/)
* **Typography & Styling:** Google Fonts, CSS Custom Properties, Glassmorphism, CSS Grid & Flexbox
* **Storage:** Browser `localStorage` API

---

## 📁 Project Structure

```text
movie-booking-app/
│
├── index.html        # Main HTML layout, modals, and structure
├── style.css         # Custom dark theme, animations, and responsive rules
├── script.js         # Dynamic rendering, filtering logic, and cart state
└── README.md         # Project documentation
