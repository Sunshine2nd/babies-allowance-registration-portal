// ================================
// APPLICATION FORM HANDLER
// ================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    const successMessage = document.getElementById('successMessage');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        requestedAmount: '$' + document.getElementById('requestedAmount').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        accountDetails: document.getElementById('accountDetails').value,
        applicationReason: document.getElementById('applicationReason').value,
        status: 'Pending Review',
        dateSubmitted: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };
    
    // Generate tracking number
    const trackingNumber = generateTrackingNumber();
    formData.trackingNumber = trackingNumber;
    
    // Save to localStorage
    saveApplication(formData);
    
    // Show success message
    showSuccessMessage(trackingNumber);
    
    // Reset form
    document.getElementById('applicationForm').reset();
}

function generateTrackingNumber() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `APP-${year}-${randomNum}`;
}

function saveApplication(applicationData) {
    let applications = JSON.parse(localStorage.getItem('applications')) || [];
    applications.push(applicationData);
    localStorage.setItem('applications', JSON.stringify(applications));
}

function showSuccessMessage(trackingNumber) {
    const form = document.getElementById('applicationForm');
    const successMessage = document.getElementById('successMessage');
    
    if (form && successMessage) {
        form.style.display = 'none';
        document.getElementById('trackingNumberDisplay').textContent = trackingNumber;
        successMessage.classList.remove('hidden');
    }
}

function copyTrackingNumber() {
    const trackingNumber = document.getElementById('trackingNumberDisplay').textContent;
    navigator.clipboard.writeText(trackingNumber).then(() => {
        alert('Tracking number copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}
