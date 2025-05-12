/**
 * Main JavaScript file for client-side functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Handle flash message dismissal
  const flashMessages = document.querySelectorAll('.flash-message');
  flashMessages.forEach(message => {
    // Auto-dismiss flash messages after 5 seconds
    setTimeout(() => {
      message.style.display = 'none';
    }, 5000);
    
    // Allow manual dismissal with close button
    const closeBtn = message.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        message.style.display = 'none';
      });
    }
  });
  
  // Add form validation feedback
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
      // Add visual feedback on input validation
      input.addEventListener('input', function() {
        if (this.validity.valid) {
          this.classList.remove('invalid');
          this.classList.add('valid');
        } else {
          this.classList.remove('valid');
          this.classList.add('invalid');
        }
      });
    });
  });

  // Autocomplete for search bar
  const searchForm = document.querySelector('.search-bar');
  if (searchForm) {
    const input = searchForm.querySelector('input[name="search"]');
    // Create suggestion box
    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'autocomplete-suggestions';
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.background = '#fff';
    suggestionBox.style.border = '1px solid #ccc';
    suggestionBox.style.zIndex = 1000;
    suggestionBox.style.width = input.offsetWidth + 'px';
    suggestionBox.style.maxHeight = '220px';
    suggestionBox.style.overflowY = 'auto';
    suggestionBox.style.display = 'none';
    suggestionBox.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(suggestionBox);

    let lastQuery = '';
    input.addEventListener('input', async function() {
      const q = this.value.trim();
      lastQuery = q;
      if (q.length < 2) {
        suggestionBox.style.display = 'none';
        suggestionBox.innerHTML = '';
        return;
      }
      const res = await fetch(`/api/titles/suggest?query=${encodeURIComponent(q)}`);
      const suggestions = await res.json();
      if (input.value.trim() !== lastQuery) return; // Prevent race
      if (suggestions.length === 0) {
        suggestionBox.style.display = 'none';
        suggestionBox.innerHTML = '';
        return;
      }
      suggestionBox.innerHTML = suggestions.map(s =>
        `<div class="autocomplete-suggestion" data-id="${s._id}" style="padding:0.5rem;cursor:pointer;display:flex;align-items:center;gap:0.5rem;">
          <img src="${s.imageUrl || '/default.jpg'}" alt="" style="width:32px;height:48px;object-fit:cover;border-radius:4px;" />
          <span>${s.name}</span>
        </div>`
      ).join('');
      suggestionBox.style.display = 'block';
    });
    // Handle click
    suggestionBox.addEventListener('mousedown', function(e) {
      const target = e.target.closest('.autocomplete-suggestion');
      if (target) {
        window.location.href = `/titles/${target.dataset.id}`;
      }
    });
    // Hide on blur
    input.addEventListener('blur', function() {
      setTimeout(() => { suggestionBox.style.display = 'none'; }, 100);
    });
    input.addEventListener('focus', function() {
      if (suggestionBox.innerHTML) suggestionBox.style.display = 'block';
    });
  }
});