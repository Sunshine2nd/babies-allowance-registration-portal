// ================================
// CONTACT FORM HANDLER
// ================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

function handleContactSubmit(e) {
    e.preventDefault();
    
    const contactData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        trackingNumber: document.getElementById('trackingNumber').value || 'N/A',
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        submittedAt: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Save to localStorage
    saveContactMessage(contactData);
    
    // Show success message
    showContactSuccess();
    
    // Reset form
    document.getElementById('contactForm').reset();
}

function saveContactMessage(messageData) {
    let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    messages.push(messageData);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

function showContactSuccess() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('contactSuccess');
    
    if (form && successMessage) {
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
    }
}

function resetContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('contactSuccess');
    
    if (form && successMessage) {
        form.style.display = 'block';
        successMessage.classList.add('hidden');
        form.reset();
        form.scrollIntoView({ behavior: 'smooth' });
    }
}
