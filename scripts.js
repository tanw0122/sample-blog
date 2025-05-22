// ReCARvery JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('show');
    });
  }
  
  // Workshop filter functionality
  setupWorkshopFilters();
  
  // Diagnosis page issue filtering
  setupDiagnosisFilters();
  
  // Scroll to top button
  setupScrollToTop();
  
  // Get URL parameters for workshop filtering
  applyUrlFilters();
});

// Workshop filters
function setupWorkshopFilters() {
  const regionSelect = document.getElementById('region');
  const ratingInput = document.getElementById('rating');
  const specializationSelect = document.getElementById('specialization');
  const priceDisplayCheckbox = document.getElementById('price-displayed');
  const resetButton = document.querySelector('.reset-button');
  const workshopCards = document.querySelectorAll('.workshop-card');
  
  if (!regionSelect || !workshopCards.length) return; // Exit if we're not on the workshops page
  
  const filterWorkshops = () => {
    const selectedRegion = regionSelect.value;
    const selectedRating = parseInt(ratingInput.value);
    const selectedSpecialization = specializationSelect.value;
    const showPriceDisplayedOnly = priceDisplayCheckbox && priceDisplayCheckbox.checked;
    
    workshopCards.forEach(card => {
      // Get workshop data
      const region = card.querySelector('.workshop-address').textContent.split('•')[1].trim();
      const ratingText = card.querySelector('.workshop-reviews').textContent;
      const rating = parseFloat(ratingText.split(' ')[0]);
      const specializations = Array.from(card.querySelectorAll('.workshop-tag')).map(tag => tag.textContent.toLowerCase());
      const hasPriceDisplayed = card.querySelector('.workshop-price-value').textContent.includes('$');
      
      // Apply filters
      let show = true;
      
      if (selectedRegion !== 'all' && !region.toLowerCase().includes(selectedRegion.toLowerCase())) {
        show = false;
      }
      
      if (selectedRating > 0 && rating < selectedRating) {
        show = false;
      }
      
      if (selectedSpecialization !== 'all' && !specializations.some(spec => 
        spec.toLowerCase().includes(selectedSpecialization.replace('-', ' ').toLowerCase())
      )) {
        show = false;
      }
      
      if (showPriceDisplayedOnly && !hasPriceDisplayed) {
        show = false;
      }
      
      card.style.display = show ? 'block' : 'none';
    });
    
    // Check if we need to show "no results" message
    const visibleCards = Array.from(workshopCards).filter(card => card.style.display !== 'none');
    const noResultsMessage = document.querySelector('.no-results-message');
    
    if (visibleCards.length === 0) {
      if (!noResultsMessage) {
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.textContent = 'No workshops match your filters. Please try different criteria.';
        message.style.textAlign = 'center';
        message.style.padding = '2rem';
        message.style.gridColumn = '1 / -1';
        
        const workshopList = document.querySelector('.workshop-list');
        workshopList.appendChild(message);
      }
    } else if (noResultsMessage) {
      noResultsMessage.remove();
    }
  };
  
  // Add event listeners
  if (regionSelect) regionSelect.addEventListener('change', filterWorkshops);
  if (ratingInput) ratingInput.addEventListener('input', function() {
    const ratingDisplay = document.querySelector('.rating-display span:first-child');
    if (ratingDisplay) {
      ratingDisplay.textContent = this.value > 0 ? `${this.value}★+` : 'Any';
    }
    filterWorkshops();
  });
  if (specializationSelect) specializationSelect.addEventListener('change', filterWorkshops);
  if (priceDisplayCheckbox) priceDisplayCheckbox.addEventListener('change', filterWorkshops);
  
  // Reset filters
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      if (regionSelect) regionSelect.value = 'all';
      if (ratingInput) {
        ratingInput.value = 0;
        const ratingDisplay = document.querySelector('.rating-display span:first-child');
        if (ratingDisplay) ratingDisplay.textContent = 'Any';
      }
      if (specializationSelect) specializationSelect.value = 'all';
      if (priceDisplayCheckbox) priceDisplayCheckbox.checked = false;
      
      filterWorkshops();
    });
  }
}

// Diagnosis page filters
function setupDiagnosisFilters() {
  const searchInput = document.getElementById('issue-search');
  const issueCards = document.querySelectorAll('.card');
  
  if (!searchInput || !issueCards.length) return; // Exit if we're not on the diagnosis page
  
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    issueCards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const symptoms = Array.from(card.querySelectorAll('.symptom-list li'))
        .map(item => item.textContent.toLowerCase());
      
      const matchesSearch = 
        title.includes(searchTerm) || 
        symptoms.some(symptom => symptom.includes(searchTerm));
      
      card.style.display = matchesSearch ? 'block' : 'none';
    });
    
    // Check if we need to show "no results" message
    const visibleCards = Array.from(issueCards).filter(card => card.style.display !== 'none');
    const noResultsMessage = document.querySelector('.no-results-message');
    
    if (visibleCards.length === 0) {
      if (!noResultsMessage) {
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.textContent = 'No issues match your search. Please try different keywords.';
        message.style.textAlign = 'center';
        message.style.padding = '2rem';
        message.style.gridColumn = '1 / -1';
        
        const cardGrid = document.querySelector('.card-grid');
        if (cardGrid) cardGrid.appendChild(message);
      }
    } else if (noResultsMessage) {
      noResultsMessage.remove();
    }
  });
}

// Apply URL parameters as filters
function applyUrlFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  const issue = urlParams.get('issue');
  
  if (issue && window.location.pathname.includes('workshops.html')) {
    const specializationSelect = document.getElementById('specialization');
    
    // Map issue to specialization
    const issueToSpecMapping = {
      'engine-wont-start': 'Engine Service',
      'brake-problems': 'Brake Service',
      'overheating-engine': 'engine-repair',
      'battery-issues': 'battery-service',
      'flat-tire': 'tyre-service',
      'transmission-problems': 'transmission'
    };
    
   // const specialization = issueToSpecMapping[issue] || 'all';
    const specialization = issue || 'all';
    
    if (specializationSelect && specialization !== 'all') {
      specializationSelect.value = specialization;
      
      // Trigger the change event
      const event = new Event('change');
      specializationSelect.dispatchEvent(event);
    }
    
    // Add issue banner at the top
    const issueFormatted = issue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const container = document.querySelector('.container');
    
    if (container) {
      const banner = document.createElement('div');
      banner.className = 'issue-banner';
      banner.innerHTML = `
        <p>Showing workshops that can help with: <strong>${issueFormatted}</strong></p>
        <button class="clear-issue">Clear</button>
      `;
      banner.style.backgroundColor = '#E5DEFF';
      banner.style.padding = '1rem';
      banner.style.borderRadius = '0.5rem';
      banner.style.marginBottom = '1.5rem';
      banner.style.display = 'flex';
      banner.style.justifyContent = 'space-between';
      banner.style.alignItems = 'center';
      
      const workshopsContainer = document.querySelector('.workshops-container');
      if (workshopsContainer) {
        workshopsContainer.parentNode.insertBefore(banner, workshopsContainer);
      }
      
      const clearButton = banner.querySelector('.clear-issue');
      if (clearButton) {
        clearButton.addEventListener('click', function() {
          window.location.href = 'workshops.html';
        });
      }
    }
  }
}

// Scroll to top functionality
function setupScrollToTop() {
  // Create scroll to top button if it doesn't exist
  let scrollButton = document.querySelector('.scroll-to-top');
  
  if (!scrollButton) {
    scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '&uarr;';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);
    
    scrollButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        scrollButton.classList.add('show');
      } else {
        scrollButton.classList.remove('show');
      }
    });
  }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
