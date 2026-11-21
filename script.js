
/* =========================================
   PRIME DRIVE MOTORS
   WEBSITE INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // =====================================
  // 1. PAGE LOADER
  // =====================================

  const pageLoader = document.getElementById("pageLoader");

  window.addEventListener("load", () => {
    if (pageLoader) {
      pageLoader.classList.add("loaded");
    }
  });

  // Fallback in case the load event has already happened.
  if (document.readyState === "complete" && pageLoader) {
    pageLoader.classList.add("loaded");
  }


  // =====================================
  // 2. MOBILE HAMBURGER MENU
  // =====================================

  const menuToggle = document.getElementById("menuToggle");
  const navWrap = document.getElementById("navWrap");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !navWrap) return;

    menuToggle.classList.remove("active");
    navWrap.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navWrap) {

    menuToggle.addEventListener("click", () => {

      const isOpen = navWrap.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );

      document.body.classList.toggle("menu-open", isOpen);

    });

    // Close the menu when a navigation link is clicked.
    navLinks.forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu when the visitor clicks outside it.
    document.addEventListener("click", event => {

      const clickedInsideMenu = navWrap.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }

    });

    // Close the menu when Escape is pressed.
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close the menu when returning to desktop width.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });

  }


  // =====================================
  // 3. STICKY NAVIGATION
  // =====================================

  const siteHeader = document.getElementById("siteHeader");

  function updateHeader() {

    if (!siteHeader) return;

    if (window.scrollY > 60) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }

  }

  window.addEventListener("scroll", updateHeader);
  updateHeader();


  // =====================================
  // 4. SCROLL REVEAL ANIMATIONS
  // =====================================

  const revealElements = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("revealed");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    // Show everything if the browser does not support IntersectionObserver.
    revealElements.forEach(element => {
      element.classList.add("revealed");
    });

  }


  // =====================================
  // 5. BACK TO TOP BUTTON
  // =====================================

  const backToTop = document.getElementById("backToTop");

  function updateBackToTop() {

    if (!backToTop) return;

    if (window.scrollY > 450) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }

  }

  window.addEventListener("scroll", updateBackToTop);
  updateBackToTop();

  if (backToTop) {

    backToTop.addEventListener("click", () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }


  // =====================================
  // 6. AUTOMATIC COPYRIGHT YEAR
  // =====================================

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // =====================================
  // 7. IMAGE FADE-IN EFFECT
  // =====================================

  const images = document.querySelectorAll(
    ".vehicle-image, .welcome-image"
  );

  images.forEach(image => {

    image.style.opacity = "0";
    image.style.transition = "opacity 0.7s ease";

    function showImage() {
      image.style.opacity = "1";
    }

    if (image.complete && image.naturalWidth > 0) {
      showImage();
    } else {
      image.addEventListener("load", showImage, { once: true });
    }

    image.addEventListener("error", () => {
      image.style.opacity = "1";
    }, { once: true });

  });


  // =====================================
  // 8. SMOOTH INTERNAL PAGE SCROLLING
  // =====================================

  const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {

        event.preventDefault();

        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  // =====================================
  // 9. CONTACT PHONE NUMBER
  // =====================================

  const phoneLinks = document.querySelectorAll(
    'a[href="tel:09133819307"]'
  );

  phoneLinks.forEach(link => {
    link.setAttribute("aria-label", "Call PrimeDrive Motors on 09133819307");
  });


  // =====================================
  // 10. WEBSITE READY
  // =====================================

  console.log("PrimeDrive Motors website is ready.");

});

/* =========================================
   PRIMEDRIVE MOTORS - INVENTORY FUNCTIONALITY
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const inventoryGrid = document.getElementById("inventoryGrid");
  const searchInput = document.getElementById("vehicleSearch");
  const categoryFilter = document.getElementById("vehicleFilter");
  const resultsCounter = document.getElementById("inventoryResults");
  const emptyMessage = document.getElementById("inventoryEmpty");

  // Stop if this is not the inventory page
  if (
    !inventoryGrid ||
    !searchInput ||
    !categoryFilter ||
    !resultsCounter ||
    !emptyMessage
  ) {
    return;
  }

  const vehicleCards = Array.from(
    inventoryGrid.querySelectorAll(".inventory-card")
  );

  function filterVehicles() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();

    let visibleVehicles = 0;

    vehicleCards.forEach(function (card) {
      const vehicleName = card.textContent.toLowerCase();
      const vehicleCategory = (
        card.dataset.category || ""
      ).toLowerCase();

      const matchesSearch = vehicleName.includes(searchText);

      const matchesCategory =
        selectedCategory === "all" ||
        vehicleCategory === selectedCategory;

      const shouldShow = matchesSearch && matchesCategory;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleVehicles++;
      }
    });

    // Update results counter
    resultsCounter.textContent =
      visibleVehicles +
      (visibleVehicles === 1 ? " vehicle found" : " vehicles found");

    // Show or hide empty message
    emptyMessage.hidden = visibleVehicles !== 0;

    // Show the grid only when vehicles are available
    inventoryGrid.hidden = visibleVehicles === 0;
  }

  // Search as the visitor types
  searchInput.addEventListener("input", filterVehicles);

  // Filter when the category changes
  categoryFilter.addEventListener("change", filterVehicles);

  // Run once when the page opens
  filterVehicles();
});

/* =========================================
   PRIMEDRIVE MOTORS - CAR DETAILS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const detailTitle = document.getElementById("detailTitle");

  // Only run this code on the Car Details page
  if (!detailTitle) return;

  const vehicles = {
    "bmw-5-series": {
      name: "BMW 5 Series",
      brand: "BMW",
      model: "5 Series",
      category: "Luxury",
      body: "Sedan",
      subtitle: "Luxury Executive Sedan",
      transmission: "Automatic",
      fuel: "Petrol",
      condition: "Enquire for details",
      description:
        "The BMW 5 Series brings together executive styling, a refined cabin and an engaging driving experience. Its elegant design and thoughtfully arranged interior make it an attractive choice for drivers who appreciate modern luxury.",
      features: [
        "Premium Interior",
        "Advanced Technology",
        "Modern Exterior Design",
        "Comfortable Cabin",
        "Driver Assistance Features",
        "Refined Driving Experience"
      ],
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=85"
      ]
    },

    "mercedes-s-class": {
      name: "Mercedes-Benz S-Class",
      brand: "Mercedes-Benz",
      model: "S-Class",
      category: "Luxury",
      body: "Sedan",
      subtitle: "Premium Luxury Sedan",
      transmission: "Automatic",
      fuel: "Petrol",
      condition: "Enquire for details",
      description:
        "The Mercedes-Benz S-Class represents sophisticated luxury and comfort. Its elegant appearance, spacious interior and technology-focused design create an impressive executive vehicle experience.",
      features: [
        "Luxury Cabin Design",
        "Premium Seating",
        "Advanced Infotainment",
        "Elegant Exterior",
        "Comfort Technology",
        "Executive Styling"
      ],
      images: [
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1618843479612-fb7c5f7d5c3b?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1400&q=85"
      ]
    },

    "audi-a6": {
      name: "Audi A6",
      brand: "Audi",
      model: "A6",
      category: "Luxury",
      body: "Sedan",
      subtitle: "Modern Executive Sedan",
      transmission: "Automatic",
      fuel: "Petrol",
      condition: "Enquire for details",
      description:
        "The Audi A6 combines clean exterior styling with a modern cabin and a technology-focused driving environment. It is designed for drivers who value understated sophistication and everyday comfort.",
      features: [
        "Modern Cabin",
        "Digital Technology",
        "Elegant Body Design",
        "Comfortable Seating",
        "Premium Interior Finish",
        "Executive Styling"
      ],
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1600705722908-bab1c0b0c5a7?auto=format&fit=crop&w=1400&q=85"
      ]
    },

    "range-rover-sport": {
      name: "Range Rover Sport",
      brand: "Land Rover",
      model: "Range Rover Sport",
      category: "SUV",
      body: "Luxury SUV",
      subtitle: "Luxury Performance SUV",
      transmission: "Automatic",
      fuel: "Petrol",
      condition: "Enquire for details",
      description:
        "The Range Rover Sport combines commanding SUV proportions with a refined interior and confident road presence. Its design brings together luxury, practicality and a distinctive modern appearance.",
      features: [
        "Elevated Driving Position",
        "Premium Interior",
        "Spacious Cabin",
        "Modern Exterior Styling",
        "Advanced Technology",
        "Versatile SUV Design"
      ],
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1519583272095-6433daf26b6e?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85"
      ]
    },

    "toyota-land-cruiser": {
      name: "Toyota Land Cruiser",
      brand: "Toyota",
      model: "Land Cruiser",
      category: "SUV",
      body: "Full-Size SUV",
      subtitle: "Premium Full-Size SUV",
      transmission: "Automatic",
      fuel: "Petrol",
      condition: "Enquire for details",
      description:
        "The Toyota Land Cruiser is known for its substantial SUV design, spacious interior and versatile character. It offers a commanding presence for drivers looking for a large and practical vehicle.",
      features: [
        "Spacious Interior",
        "Commanding Road Presence",
        "Comfortable Seating",
        "Large SUV Design",
        "Modern Cabin Technology",
        "Versatile Interior Space"
      ],
      images: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1519583272095-6433daf26b6e?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1400&q=85"
      ]
    },

    "porsche-911": {
      name: "Porsche 911",
      brand: "Porsche",
      model: "911",
      category: "Sports",
      body: "Sports Coupe",
      subtitle: "Premium Sports Coupe",
      transmission: "Automatic",
      fuel: "Petrol",
      condition: "Enquire for details",
      description:
        "The Porsche 911 is recognised for its distinctive silhouette, driver-focused design and unmistakable sports-car character. Its carefully designed cabin complements its iconic exterior appearance.",
      features: [
        "Iconic Sports Styling",
        "Driver-Focused Cabin",
        "Premium Interior",
        "Distinctive Exterior",
        "Modern Technology",
        "Sports Coupe Design"
      ],
      images: [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85"
      ]
    },

    "toyota-camry": {
      name: "Toyota Camry",
      brand: "Toyota",
      model: "Camry",
      category: "Sedan",
      body: "Sedan",
      subtitle: "Modern Family Sedan",
      transmission: "Automatic",
      fuel: "Petrol",
      condition: "Enquire for details",
      description:
        "The Toyota Camry offers a practical sedan design with a comfortable cabin and a clean, modern appearance. Its balanced proportions make it a popular choice for everyday driving.",
      features: [
        "Comfortable Cabin",
        "Modern Dashboard",
        "Spacious Seating",
        "Elegant Exterior",
        "Practical Sedan Design",
        "Everyday Convenience"
      ],
      images: [
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85"
      ]
    },

    "lexus-rx": {
      name: "Lexus RX",
      brand: "Lexus",
      model: "RX",
      category: "SUV",
      body: "Luxury SUV",
      subtitle: "Premium Luxury SUV",
      transmission: "Automatic",
      fuel: "Petrol",
      condition: "Enquire for details",
      description:
        "The Lexus RX presents a refined SUV design with a comfortable cabin and carefully finished interior. It is suited to drivers who appreciate modern styling and a premium driving environment.",
      features: [
        "Refined Interior",
        "Premium Seating",
        "Modern Technology",
        "Distinctive Front Design",
        "Spacious Cabin",
        "Luxury SUV Styling"
      ],
      images: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1519583272095-6433daf26b6e?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1400&q=85"
      ]
    },

    "ford-mustang": {
      name: "Ford Mustang",
      brand: "Ford",
      model: "Mustang",
      category: "Sports",
      body: "Sports Coupe",
      subtitle: "Iconic Sports Coupe",
      transmission: "Automatic",
      fuel: "Petrol",
      condition: "Enquire for details",
      description:
        "The Ford Mustang features a recognisable sports-car profile, bold exterior styling and a driver-oriented interior. Its distinctive design gives it a strong presence wherever it goes.",
      features: [
        "Bold Exterior Styling",
        "Sports-Inspired Interior",
        "Driver-Focused Design",
        "Distinctive Body Shape",
        "Modern Cabin Technology",
        "Iconic Coupe Appearance"
      ],
      images: [
        "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85"
      ]
    },

    "mercedes-g-class": {
      name: "Mercedes-Benz G-Class",
      brand: "Mercedes-Benz",
      model: "G-Class",
      category: "Luxury",
      body: "Luxury SUV",
      subtitle: "Iconic Luxury SUV",
      transmission: "Automatic",
      fuel: "Petrol",
      condition: "Enquire for details",
      description:
        "The Mercedes-Benz G-Class is known for its unmistakable box-shaped design and premium character. Its bold exterior and carefully appointed cabin create a distinctive luxury SUV experience.",
      features: [
        "Iconic Boxy Design",
        "Premium Cabin",
        "Distinctive Exterior",
        "Comfortable Seating",
        "Modern Technology",
        "Commanding SUV Presence"
      ],
      images: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1519583272095-6433daf26b6e?auto=format&fit=crop&w=1400&q=85",
        "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1400&q=85"
      ]
    }
  };

  // Get the vehicle slug from the page URL
  const params = new URLSearchParams(window.location.search);
  const vehicleSlug = params.get("vehicle") || "bmw-5-series";

  const vehicle = vehicles[vehicleSlug] || vehicles["bmw-5-series"];

  // Update page title
  document.title = vehicle.name + " | PrimeDrive Motors";

  // Update main vehicle information
  function updateText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  updateText("detailHeroTitle", vehicle.name);
  updateText("detailTitle", vehicle.name);
  updateText("detailSubtitle", vehicle.subtitle);
  updateText("detailBrand", vehicle.brand);
  updateText("detailModel", vehicle.model);
  updateText("detailCategory", vehicle.category);
  updateText("detailBody", vehicle.body);
  updateText("detailTransmission", vehicle.transmission);
  updateText("detailFuel", vehicle.fuel);
  updateText("detailCondition", vehicle.condition);
  updateText("detailDescription", vehicle.description);

  // Update browser title and hero text
  const heroEyebrow = document.querySelector(".detail-eyebrow");

  if (heroEyebrow) {
    heroEyebrow.textContent = vehicle.category.toUpperCase() +
      " COLLECTION";
  }

  // Update vehicle gallery
  const mainImage = document.getElementById("detailMainImage");
  const thumbnails = document.querySelectorAll(".detail-thumbnail");

  thumbnails.forEach(function (thumbnail, index) {
    const imageUrl = vehicle.images[index];

    if (!imageUrl) return;

    thumbnail.dataset.image = imageUrl;

    const thumbnailImage = thumbnail.querySelector("img");

    if (thumbnailImage) {
      thumbnailImage.src = imageUrl.replace(
        "w=1400",
        "w=300"
      );

      thumbnailImage.alt = vehicle.name + " gallery image " + (index + 1);
    }

    if (index === 0) {
      thumbnail.classList.add("active");

      if (mainImage) {
        mainImage.src = imageUrl;
        mainImage.alt = vehicle.name;
      }
    } else {
      thumbnail.classList.remove("active");
    }
  });

  // Make gallery thumbnails clickable
  thumbnails.forEach(function (thumbnail) {
    thumbnail.addEventListener("click", function () {
      const imageUrl = thumbnail.dataset.image;

      if (!imageUrl || !mainImage) return;

      mainImage.style.opacity = "0";

      setTimeout(function () {
        mainImage.src = imageUrl;
        mainImage.alt = vehicle.name;
        mainImage.style.opacity = "1";
      }, 180);

      thumbnails.forEach(function (item) {
        item.classList.remove("active");
      });

      thumbnail.classList.add("active");
    });
  });

  // Update vehicle features
  const featuresContainer = document.getElementById("detailFeatures");

  if (featuresContainer) {
    featuresContainer.innerHTML = "";

    vehicle.features.forEach(function (feature) {
      const featureElement = document.createElement("div");

      featureElement.className = "detail-feature";

      const icon = document.createElement("span");
      icon.className = "feature-icon";
      icon.textContent = "✦";

      const text = document.createElement("span");
      text.textContent = feature;

      featureElement.append(icon, text);
      featuresContainer.appendChild(featureElement);
    });
  }

  // Update WhatsApp enquiry message
  const whatsappButton = document.getElementById("detailWhatsApp");

  if (whatsappButton) {
    const message = "Hello PrimeDrive Motors, I am interested in the " +
      vehicle.name +
      ". Please provide more information about this vehicle.";

    whatsappButton.href =
      "https://wa.me/2349133819307?text=" +
      encodeURIComponent(message);
  }

});

// ==========================================
// PRIMEDRIVE MOTORS - CONTACT FORM
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  // Only run this code on the contact page
  if (!contactForm) return;

  const nameInput = document.getElementById("contactName");
  const phoneInput = document.getElementById("contactPhone");
  const emailInput = document.getElementById("contactEmail");
  const subjectInput = document.getElementById("contactSubject");
  const messageInput = document.getElementById("contactMessage");
  const consentInput = document.getElementById("contactConsent");

  const statusMessage = document.getElementById("contactFormStatus");

  const errorFields = {
    name: document.getElementById("nameError"),
    phone: document.getElementById("phoneError"),
    email: document.getElementById("emailError"),
    subject: document.getElementById("subjectError"),
    message: document.getElementById("messageError"),
    consent: document.getElementById("consentError")
  };

  // Display an error beside a field
  function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
  }

  // Clear an error
  function clearError(input, errorElement) {
    errorElement.textContent = "";
    input.classList.remove("invalid");
    input.setAttribute("aria-invalid", "false");
  }

  // Clear all errors
  function clearAllErrors() {
    clearError(nameInput, errorFields.name);
    clearError(phoneInput, errorFields.phone);
    clearError(emailInput, errorFields.email);
    clearError(subjectInput, errorFields.subject);
    clearError(messageInput, errorFields.message);
    clearError(consentInput, errorFields.consent);
  }

  // Validate the form
  function validateForm() {
    let isValid = true;
    let firstInvalidField = null;

    clearAllErrors();

    function markInvalid(input, errorElement, message) {
      showError(input, errorElement, message);
      isValid = false;

      if (!firstInvalidField) {
        firstInvalidField = input;
      }
    }

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value;
    const message = messageInput.value.trim();

    // Name validation
    if (name.length < 2) {
      markInvalid(
        nameInput,
        errorFields.name,
        "Please enter your full name."
      );
    }

    // Phone validation
    const cleanPhone = phone.replace(/[\s()-]/g, "");
    const phoneDigits = cleanPhone.replace(/\D/g, "");

    if (
      !/^\+?\d+$/.test(cleanPhone) ||
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      markInvalid(
        phoneInput,
        errorFields.phone,
        "Please enter a valid phone number."
      );
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      markInvalid(
        emailInput,
        errorFields.email,
        "Please enter a valid email address."
      );
    }

    // Subject validation
    if (!subject) {
      markInvalid(
        subjectInput,
        errorFields.subject,
        "Please select an enquiry subject."
      );
    }

    // Message validation
    if (message.length < 10) {
      markInvalid(
        messageInput,
        errorFields.message,
        "Your message must contain at least 10 characters."
      );
    }

    // Consent validation
    if (!consentInput.checked) {
      markInvalid(
        consentInput,
        errorFields.consent,
        "Please confirm before continuing."
      );
    }

    if (!isValid && firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  // Clear individual errors as the customer edits fields
  nameInput.addEventListener("input", () => {
    clearError(nameInput, errorFields.name);
  });

  phoneInput.addEventListener("input", () => {
    clearError(phoneInput, errorFields.phone);
  });

  emailInput.addEventListener("input", () => {
    clearError(emailInput, errorFields.email);
  });

  subjectInput.addEventListener("change", () => {
    clearError(subjectInput, errorFields.subject);
  });

  messageInput.addEventListener("input", () => {
    clearError(messageInput, errorFields.message);
  });

  consentInput.addEventListener("change", () => {
    clearError(consentInput, errorFields.consent);
  });

  // Handle form submission
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    statusMessage.textContent = "";

    if (!validateForm()) {
      statusMessage.textContent =
        "Please correct the highlighted fields before continuing.";
      return;
    }

    const customerName = nameInput.value.trim();
    const customerPhone = phoneInput.value.trim();
    const customerEmail = emailInput.value.trim();
    const enquirySubject = subjectInput.value;
    const customerMessage = messageInput.value.trim();

    // Prepare the WhatsApp enquiry
    const whatsappMessage = `
PRIMEDRIVE MOTORS - CUSTOMER ENQUIRY

Customer Name: ${customerName}

Phone Number: ${customerPhone}

Email Address: ${customerEmail}

Enquiry Subject: ${enquirySubject}

Message:
${customerMessage}

Thank you.
    `.trim();

    const whatsappURL =
      "https://wa.me/2349133819307?text=" +
      encodeURIComponent(whatsappMessage);

    statusMessage.textContent =
      "WhatsApp is opening. Review your enquiry and press Send there.";

    // Open WhatsApp in a new tab
    window.open(whatsappURL, "_blank");
  });
});
