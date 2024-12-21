/* dropdown.js
   Handles dropdown open/close logic and counters
*/

function toggleDropdown(dropdownId) {
  // Close all other dropdowns first
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    if (dropdown.id !== dropdownId) {
      dropdown.classList.remove('header-link-active');
      dropdown.querySelector('.dropdown-content').style.display = 'none';
    }
  });

  // Toggle the clicked dropdown
  const dropdown = document.getElementById(dropdownId);
  dropdown.classList.toggle('header-link-active');
  const dropdownContent = dropdown.querySelector('.dropdown-content');
  dropdownContent.style.display = 
    dropdownContent.style.display === 'block' ? 'none' : 'block';
}

// Close all dropdowns when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.classList.remove('header-link-active');
    dropdown.querySelector('.dropdown-content').style.display = 'none';
  });
});

// Prevent click inside dropdown content from closing it
document.querySelectorAll('.dropdown-content').forEach(content => {
  content.addEventListener('click', event => {
    event.stopPropagation();
  });
});

// Attach toggle events
document.querySelectorAll('.dropdown').forEach(dropdown => {
  dropdown.addEventListener('click', event => {
    event.stopPropagation();
    toggleDropdown(dropdown.id);
  });
});

// Update badge count
function updateDropdownCount(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const checkedBoxes = dropdown.querySelectorAll('input[type="checkbox"]:checked').length;

  if (checkedBoxes > 0) {
    dropdown.setAttribute('data-count', checkedBoxes);
    dropdown.classList.add('has-count');
  } else {
    dropdown.removeAttribute('data-count');
    dropdown.classList.remove('has-count');
  }
}

// Add event listeners to all checkboxes in dropdowns
document.querySelectorAll('.dropdown input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', event => {
    const dropdownId = event.target.closest('.dropdown').id;
    updateDropdownCount(dropdownId);
  });
});

// Setup Mobile Dropdowns
function setupMobileDropdowns() {
  if (window.innerWidth <= 768) {
    // Close dropdown when clicking outside
    document.addEventListener('click', event => {
      if (!event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
          content.style.display = 'none';
        });
        document.querySelectorAll('.dropdown').forEach(dropdown => {
          dropdown.classList.remove('header-link-active');
        });
      }
    });

    // Prevent body scroll when dropdown is open
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.addEventListener('click', () => {
        if (dropdown.classList.contains('header-link-active')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
    });
  }
}

window.addEventListener('load', setupMobileDropdowns);
window.addEventListener('resize', setupMobileDropdowns); 