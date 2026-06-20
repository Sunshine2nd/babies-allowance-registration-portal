// ================================
// APPLICATION TRACKING HANDLER
// ================================

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const trackingInput = document.getElementById('trackingInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (trackingInput) {
        trackingInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});

function handleSearch() {
    const trackingNumber = document.getElementById('trackingInput').value.trim().toUpperCase();
    
    if (!trackingNumber) {
        alert('Please enter a tracking number');
        return;
    }
    
    const application = findApplicationByTrackingNumber(trackingNumber);
    
    if (application) {
        displayApplicationDetails(application);
    } else {
        showNotFound();
    }
}

function findApplicationByTrackingNumber(trackingNumber) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    return applications.find(app => app.trackingNumber === trackingNumber);
}

function displayApplicationDetails(application) {
    const resultsSection = document.getElementById('resultsSection');
    const notFoundMessage = document.getElementById('notFoundMessage');
    const resultDetails = document.getElementById('resultDetails');
    
    notFoundMessage.classList.add('hidden');
    resultDetails.classList.remove('hidden');
    resultsSection.classList.remove('hidden');
    
    // Populate details
    document.getElementById('resultTrackingNumber').textContent = application.trackingNumber;
    document.getElementById('resultName').textContent = application.fullName;
    document.getElementById('resultEmail').textContent = application.email;
    document.getElementById('resultPhone').textContent = application.phone;
    document.getElementById('resultAmount').textContent = application.requestedAmount;
    document.getElementById('resultPaymentMethod').textContent = application.paymentMethod;
    document.getElementById('resultDate').textContent = application.dateSubmitted;
    document.getElementById('resultStatus').textContent = application.status;
    document.getElementById('resultReason').textContent = application.applicationReason;
    document.getElementById('resultNotes').textContent = application.adminNotes || 'No notes at this time.';
    
    // Set status badge
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = application.status;
    statusBadge.className = 'status-badge ' + application.status.toLowerCase().replace(/\s+/g, '');
    
    // Update timeline
    updateTimeline(application.dateSubmitted, application.status);
}

function updateTimeline(submissionDate, status) {
    document.getElementById('timelineSubmitted').textContent = submissionDate;
    
    const timelineReview = document.getElementById('timelineReview');
    const timelineCompleted = document.getElementById('timelineCompleted');
    
    if (status === 'Pending Review') {
        timelineReview.classList.remove('hidden');
        timelineCompleted.classList.add('hidden');
    } else {
        timelineReview.classList.remove('hidden');
        document.getElementById('timelineReviewDate').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        timelineCompleted.classList.remove('hidden');
        document.getElementById('timelineCompletedDate').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        if (status === 'Approved') {
            document.getElementById('timelineCompletedText').textContent = 'Application Approved';
        } else if (status === 'Rejected') {
            document.getElementById('timelineCompletedText').textContent = 'Application Rejected';
        } else {
            document.getElementById('timelineCompletedText').textContent = 'More Information Required';
        }
    }
}

function showNotFound() {
    const resultsSection = document.getElementById('resultsSection');
    const notFoundMessage = document.getElementById('notFoundMessage');
    const resultDetails = document.getElementById('resultDetails');
    
    notFoundMessage.classList.remove('hidden');
    resultDetails.classList.add('hidden');
    resultsSection.classList.remove('hidden');
}

function clearSearch() {
    document.getElementById('trackingInput').value = '';
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('trackingInput').focus();
}
