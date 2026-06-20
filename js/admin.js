// ================================
// ADMIN DASHBOARD HANDLER
// ================================

let currentApplication = null;

document.addEventListener('DOMContentLoaded', function() {
    loadApplications();
    setupEventListeners();
    updateStats();
});

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const exportBtn = document.getElementById('exportBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterApplications);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadApplications);
    }
}

function loadApplications() {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    displayApplications(applications);
}

function displayApplications(applications) {
    const tableBody = document.getElementById('applicationsTableBody');
    const noData = document.getElementById('noData');
    
    if (applications.length === 0) {
        tableBody.innerHTML = '';
        noData.classList.remove('hidden');
        return;
    }
    
    noData.classList.add('hidden');
    tableBody.innerHTML = applications.map(app => `
        <tr>
            <td><strong>${app.trackingNumber}</strong></td>
            <td>${app.fullName}</td>
            <td>${app.email}</td>
            <td>${app.requestedAmount}</td>
            <td>
                <span class="status-badge ${app.status.toLowerCase().replace(/\s+/g, '')}">
                    ${app.status}
                </span>
            </td>
            <td>${app.dateSubmitted}</td>
            <td>
                <button class="btn btn-small btn-primary" onclick="openApplicationModal('${app.trackingNumber}')">
                    View Details
                </button>
            </td>
        </tr>
    `).join('');
}

function filterApplications() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    
    const filtered = applications.filter(app => 
        app.trackingNumber.toLowerCase().includes(searchValue) ||
        app.fullName.toLowerCase().includes(searchValue) ||
        app.email.toLowerCase().includes(searchValue)
    );
    
    displayApplications(filtered);
}

function openApplicationModal(trackingNumber) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const application = applications.find(app => app.trackingNumber === trackingNumber);
    
    if (application) {
        currentApplication = { ...application };
        
        document.getElementById('modalTrackingNumber').textContent = application.trackingNumber;
        document.getElementById('modalFullName').textContent = application.fullName;
        document.getElementById('modalEmail').textContent = application.email;
        document.getElementById('modalPhone').textContent = application.phone;
        document.getElementById('modalAmount').textContent = application.requestedAmount;
        document.getElementById('modalPaymentMethod').textContent = application.paymentMethod;
        document.getElementById('modalAccountDetails').textContent = application.accountDetails;
        document.getElementById('modalDate').textContent = application.dateSubmitted;
        document.getElementById('modalReason').textContent = application.applicationReason;
        document.getElementById('modalNotes').value = application.adminNotes || '';
        
        const statusContainer = document.getElementById('modalStatusContainer');
        statusContainer.innerHTML = `
            <span class="status-badge ${application.status.toLowerCase().replace(/\s+/g, '')}">
                ${application.status}
            </span>
        `;
        
        document.getElementById('applicationModal').classList.remove('hidden');
    }
}

function closeModal() {
    document.getElementById('applicationModal').classList.add('hidden');
    currentApplication = null;
}

function updateStatus(newStatus) {
    if (currentApplication) {
        currentApplication.status = newStatus;
    }
}

function saveChanges() {
    if (!currentApplication) return;
    
    currentApplication.adminNotes = document.getElementById('modalNotes').value;
    
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const index = applications.findIndex(app => app.trackingNumber === currentApplication.trackingNumber);
    
    if (index !== -1) {
        applications[index] = currentApplication;
        localStorage.setItem('applications', JSON.stringify(applications));
        updateStats();
        loadApplications();
        closeModal();
        alert('Application updated successfully!');
    }
}

function updateStats() {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'Pending Review').length;
    const approved = applications.filter(app => app.status === 'Approved').length;
    const rejected = applications.filter(app => app.status === 'Rejected').length;
    
    document.getElementById('totalApps').textContent = total;
    document.getElementById('pendingApps').textContent = pending;
    document.getElementById('approvedApps').textContent = approved;
    document.getElementById('rejectedApps').textContent = rejected;
}

function exportToCSV() {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    
    if (applications.length === 0) {
        alert('No applications to export');
        return;
    }
    
    const headers = ['Tracking Number', 'Full Name', 'Email', 'Phone', 'Requested Amount', 'Payment Method', 'Status', 'Date Submitted', 'Admin Notes'];
    const rows = applications.map(app => [
        app.trackingNumber,
        app.fullName,
        app.email,
        app.phone,
        app.requestedAmount,
        app.paymentMethod,
        app.status,
        app.dateSubmitted,
        app.adminNotes || ''
    ]);
    
    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('applicationModal');
    if (e.target === modal) {
        closeModal();
    }
});
