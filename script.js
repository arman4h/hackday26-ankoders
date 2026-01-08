// Student request types mapping with priority (1 = highest/urgent, 6 = lowest)
const studentRequests = {
    urgent: {
        icon: "🚨",
        message: "Urgent",
        category: "request", // Requires accept/reject
        priority: 1 // Highest priority - Red
    },
    feelingSick: {
        icon: "🤒",
        message: "Feeling Sick",
        category: "request", // Requires accept/reject
        priority: 2 // High priority - Orange
    },
    requestToStepOut: {
        icon: "🚪",
        message: "Request to Step Out",
        category: "request", // Requires accept/reject
        priority: 3 // Medium-high priority - Yellow/Orange
    },
    didntUnderstand: {
        icon: "❓",
        message: "I didn't Understand",
        category: "status", // Requires seen acknowledgment
        priority: 4 // Medium priority - Blue
    },
    taskCompleted: {
        icon: "✅",
        message: "Task Completed",
        category: "status", // Requires seen acknowledgment
        priority: 5 // Low-medium priority - Green
    },
    understand: {
        icon: "👍",
        message: "I understand",
        category: "status", // Requires seen acknowledgment
        priority: 6 // Lowest priority - Light Green
    }
};

// Get current time in readable format
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
}

// Get full timestamp for sorting
function getTimestamp() {
    return new Date().getTime();
}

// Function to get priority class name
function getPriorityClass(priority) {
    const priorityMap = {
        1: 'priority-urgent',      // Red
        2: 'priority-high',         // Orange
        3: 'priority-medium-high', // Yellow/Orange
        4: 'priority-medium',      // Blue
        5: 'priority-low-medium',  // Green
        6: 'priority-low'          // Light Green
    };
    return priorityMap[priority] || 'priority-medium';
}

// Initialize landing page
function initLandingPage() {
    const teacherBtn = document.getElementById('teacher-btn');
    const studentBtn = document.getElementById('student-btn');
    const nameInputContainer = document.getElementById('name-input-container');
    const nameInput = document.getElementById('student-name-input');
    const nameSubmitBtn = document.getElementById('name-submit-btn');

    if (teacherBtn) {
        teacherBtn.addEventListener('click', () => {
            window.location.href = 'teacher.html';
        });
    }

    if (studentBtn) {
        studentBtn.addEventListener('click', () => {
            // Toggle name input visibility
            if (nameInputContainer.style.display === 'none') {
                nameInputContainer.style.display = 'flex';
                nameInput.focus();
            } else {
                nameInputContainer.style.display = 'none';
            }
        });
    }

    if (nameSubmitBtn) {
        nameSubmitBtn.addEventListener('click', () => {
            const studentName = nameInput.value.trim();
            if (studentName) {
                // Store student name in localStorage
                localStorage.setItem('currentStudentName', studentName);
                // Redirect to student page
                window.location.href = 'student.html';
            } else {
                alert('Please enter your name');
            }
        });

        // Allow Enter key to submit
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    nameSubmitBtn.click();
                }
            });
        }
    }
}

// Initialize student page
function initStudentPage() {
    // Check if student name exists, if not redirect to index
    const studentName = localStorage.getItem('currentStudentName');
    if (!studentName) {
        window.location.href = 'index.html';
        return;
    }

    const buttonContainer = document.getElementById('button-container');
    const labelToggle = document.getElementById('label-toggle');
    const requestList = document.getElementById('request-list');
    const confirmationMessage = document.getElementById('confirmation-message');
    let showLabels = labelToggle.checked;

    // Function to get priority class name
    function getPriorityClass(priority) {
        const priorityMap = {
            1: 'priority-urgent',      // Red
            2: 'priority-high',         // Orange
            3: 'priority-medium-high', // Yellow/Orange
            4: 'priority-medium',      // Blue
            5: 'priority-low-medium',  // Green
            6: 'priority-low'          // Light Green
        };
        return priorityMap[priority] || 'priority-medium';
    }

    // Create buttons for each request type, sorted by priority
    const sortedRequestTypes = Object.keys(studentRequests).sort((a, b) => {
        return (studentRequests[a].priority || 4) - (studentRequests[b].priority || 4);
    });

    sortedRequestTypes.forEach(type => {
        const request = studentRequests[type];
        const button = document.createElement('button');
        const priorityClass = getPriorityClass(request.priority);
        button.className = `student-btn ${priorityClass}`;
        button.setAttribute('data-type', type);
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'icon';
        iconSpan.textContent = request.icon;
        
        const labelSpan = document.createElement('span');
        labelSpan.className = 'label';
        labelSpan.textContent = request.message;
        
        button.appendChild(iconSpan);
        button.appendChild(labelSpan);
        
        // Add click event listener
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.student-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const requestData = {
                id: String(getTimestamp() + Math.random()), // Unique ID for each request (as string)
                studentName: studentName,
                type: type,
                icon: request.icon,
                message: request.message,
                category: request.category,
                priority: request.priority, // Priority level (1-6)
                status: 'pending', // pending, seen, accepted, rejected
                time: getCurrentTime(),
                timestamp: getTimestamp()
            };
            
            // Get existing requests or create new array
            let allRequests = JSON.parse(localStorage.getItem('allStudentRequests') || '[]');
            
            // Add new request
            allRequests.push(requestData);
            
            // Store updated requests array
            localStorage.setItem('allStudentRequests', JSON.stringify(allRequests));
            
            // Update request listing
            updateStudentRequestList();
            
            // Show confirmation message
            confirmationMessage.style.display = 'flex';
            setTimeout(() => {
                confirmationMessage.style.display = 'none';
            }, 3000);
        });
        
        buttonContainer.appendChild(button);
    });

    // Handle toggle switch
    labelToggle.addEventListener('change', () => {
        showLabels = labelToggle.checked;
        const buttons = document.querySelectorAll('.student-btn');
        
        buttons.forEach(button => {
            if (showLabels) {
                button.classList.remove('icon-only');
            } else {
                button.classList.add('icon-only');
            }
        });
    });

    // Set initial state
    if (!showLabels) {
        const buttons = document.querySelectorAll('.student-btn');
        buttons.forEach(button => {
            button.classList.add('icon-only');
        });
    }

    // Function to update request list
    function updateStudentRequestList() {
        const allRequests = JSON.parse(localStorage.getItem('allStudentRequests') || '[]');
        
        // Filter requests for current student
        const studentRequests = allRequests.filter(req => req.studentName === studentName);
        
        // Sort by priority first (lower number = higher priority), then by timestamp (newest first)
        studentRequests.sort((a, b) => {
            const priorityA = a.priority || 4; // Default to medium if missing
            const priorityB = b.priority || 4;
            if (priorityA !== priorityB) {
                return priorityA - priorityB; // Lower priority number = higher priority
            }
            return b.timestamp - a.timestamp; // Newest first for same priority
        });
        
        if (studentRequests.length === 0) {
            requestList.innerHTML = '<div class="placeholder">No requests yet</div>';
            return;
        }
        
        requestList.innerHTML = studentRequests.map(req => {
            let statusBadge = '';
            if (req.status === 'seen') {
                statusBadge = '<span class="status-badge status-seen">✓ Teacher seen your message</span>';
            } else if (req.status === 'accepted') {
                statusBadge = '<span class="status-badge status-accepted">✓ Accepted</span>';
            } else if (req.status === 'rejected') {
                statusBadge = '<span class="status-badge status-rejected">✗ Rejected</span>';
            } else {
                statusBadge = '<span class="status-badge status-pending">Pending...</span>';
            }
            
            const priorityClass = getPriorityClass(req.priority || 4);
            
            return `
                <div class="request-item ${priorityClass}">
                    <div class="request-item-info">
                        <span class="request-item-icon">${req.icon}</span>
                        <div class="request-item-text">
                            <span class="request-item-name">${req.studentName}</span>
                            <span class="request-item-message">${req.message}</span>
                            ${statusBadge}
                        </div>
                    </div>
                    <div class="request-item-actions">
                        <button class="raise-down-btn" data-request-id="${req.id}" title="Remove this request">
                            Raise Down
                        </button>
                        <span class="request-item-time">${req.time}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Function to remove a request
    function removeRequest(requestId) {
        const allRequests = JSON.parse(localStorage.getItem('allStudentRequests') || '[]');
        const filteredRequests = allRequests.filter(req => String(req.id) !== String(requestId));
        localStorage.setItem('allStudentRequests', JSON.stringify(filteredRequests));
        updateStudentRequestList();
    }

    // Event delegation for raise down buttons
    if (requestList) {
        requestList.addEventListener('click', (e) => {
            const button = e.target.closest('.raise-down-btn');
            if (button) {
                const requestId = button.getAttribute('data-request-id');
                if (requestId) {
                    if (confirm('Are you sure you want to remove this request?')) {
                        removeRequest(requestId);
                    }
                }
            }
        });
    }

    // Initial load of request list
    updateStudentRequestList();
    
    // Poll for status updates every 1 second
    setInterval(updateStudentRequestList, 1000);
}

// Function to update request status
function updateRequestStatus(requestId, newStatus) {
    const allRequests = JSON.parse(localStorage.getItem('allStudentRequests') || '[]');
    // Convert both to strings for comparison
    const requestIndex = allRequests.findIndex(req => String(req.id) === String(requestId));
    
    if (requestIndex !== -1) {
        allRequests[requestIndex].status = newStatus;
        localStorage.setItem('allStudentRequests', JSON.stringify(allRequests));
        return true;
    }
    return false;
}

// Initialize teacher page
function initTeacherPage() {
    const allRequestsContainer = document.getElementById('all-requests-container');
    
    if (!allRequestsContainer) {
        console.error('all-requests-container not found');
        return;
    }

    // Event delegation for action buttons
    allRequestsContainer.addEventListener('click', (e) => {
        // Check if clicked element or its parent is an action button
        let button = e.target.closest('.action-btn');
        
        // If clicked on child elements (span), find the parent button
        if (!button && (e.target.classList.contains('btn-icon') || e.target.classList.contains('btn-text'))) {
            button = e.target.parentElement;
        }
        
        if (!button || !button.classList.contains('action-btn')) {
            return;
        }
        
        const requestId = button.getAttribute('data-request-id');
        const action = button.getAttribute('data-action');
        
        if (requestId && action) {
            e.preventDefault();
            e.stopPropagation();
            
            if (action === 'seen') {
                updateRequestStatus(requestId, 'seen');
            } else if (action === 'accept') {
                updateRequestStatus(requestId, 'accepted');
            } else if (action === 'reject') {
                updateRequestStatus(requestId, 'rejected');
            }
            // Update display immediately
            updateDisplay();
        }
    });

    function requiresSeenOnly(req) {
        return req.category === 'status' || req.type === 'urgent' || req.type === 'feelingSick';
    }

    function updateDisplay() {
        const allRequests = JSON.parse(localStorage.getItem('allStudentRequests') || '[]');
        
        if (allRequests.length === 0) {
            allRequestsContainer.innerHTML = `
                <div class="placeholder">
                    <p>No student requests yet</p>
                </div>
            `;
            return;
        }
        
        // Sort by priority first (lower number = higher priority), then by timestamp (newest first)
        const sortedRequests = [...allRequests].sort((a, b) => {
            const priorityA = a.priority || 4; // Default to medium if missing
            const priorityB = b.priority || 4;
            if (priorityA !== priorityB) {
                return priorityA - priorityB; // Lower priority number = higher priority
            }
            return b.timestamp - a.timestamp; // Newest first for same priority
        });
        
        allRequestsContainer.innerHTML = sortedRequests.map(req => {
            const priorityClass = getPriorityClass(req.priority || 4);
            let actionButtons = '';
            
            if (req.status === 'pending') {
                if (requiresSeenOnly(req)) {
                    // Status or special types (urgent, feeling sick) - show tick mark button
                    actionButtons = `
                        <button class="action-btn seen-btn" data-request-id="${req.id}" data-action="seen">
                            <span class="btn-icon">✓</span>
                            <span class="btn-text">Seen</span>
                        </button>
                    `;
                } else {
                    // Other request types - show accept/reject buttons
                    actionButtons = `
                        <button class="action-btn accept-btn" data-request-id="${req.id}" data-action="accept">
                            <span class="btn-icon">✓</span>
                            <span class="btn-text">Accept</span>
                        </button>
                        <button class="action-btn reject-btn" data-request-id="${req.id}" data-action="reject">
                            <span class="btn-icon">✗</span>
                            <span class="btn-text">Reject</span>
                        </button>
                    `;
                }
            } else {
                // Show current status
                let statusText = '';
                let statusClass = '';
                if (req.status === 'seen') {
                    statusText = 'Seen';
                    statusClass = 'status-seen';
                } else if (req.status === 'accepted') {
                    statusText = 'Accepted';
                    statusClass = 'status-accepted';
                } else if (req.status === 'rejected') {
                    statusText = 'Rejected';
                    statusClass = 'status-rejected';
                }
                actionButtons = `<span class="status-indicator ${statusClass}">${statusText}</span>`;
            }
            
            return `
                <div class="teacher-request-item ${priorityClass}">
                    <div class="teacher-request-icon">${req.icon}</div>
                    <div class="teacher-request-content">
                        <div class="teacher-request-name">${req.studentName}</div>
                        <div class="teacher-request-message">${req.message}</div>
                    </div>
                    <div class="teacher-request-actions">
                        ${actionButtons}
                    </div>
                    <div class="teacher-request-time">${req.time}</div>
                </div>
            `;
        }).join('');
    }

    // Initial display
    updateDisplay();

    // Poll localStorage every 1 second
    setInterval(updateDisplay, 1000);
}

// Detect which page we're on and initialize accordingly
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        initLandingPage();
    } else if (currentPage === 'student.html') {
        initStudentPage();
    } else if (currentPage === 'teacher.html') {
        initTeacherPage();
    }
});
