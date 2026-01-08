// Student request types mapping
const studentRequests = {
    restroom: {
        icon: "🚻",
        message: "Restroom"
    },
    notFeelingWell: {
        icon: "🤒",
        message: "Not feeling well"
    },
    didntUnderstand: {
        icon: "❓",
        message: "Didn't understand"
    },
    understood: {
        icon: "✅",
        message: "Understood!"
    },
    needHelp: {
        icon: "🆘",
        message: "I need help"
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

    // Create buttons for each request type
    Object.keys(studentRequests).forEach(type => {
        const request = studentRequests[type];
        const button = document.createElement('button');
        button.className = 'student-btn';
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
                studentName: studentName,
                type: type,
                icon: request.icon,
                message: request.message,
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
        
        // Sort by timestamp (newest first)
        studentRequests.sort((a, b) => b.timestamp - a.timestamp);
        
        if (studentRequests.length === 0) {
            requestList.innerHTML = '<div class="placeholder">No requests yet</div>';
            return;
        }
        
        requestList.innerHTML = studentRequests.map(req => `
            <div class="request-item">
                <div class="request-item-info">
                    <span class="request-item-icon">${req.icon}</span>
                    <div class="request-item-text">
                        <span class="request-item-name">${req.studentName}</span>
                        <span class="request-item-message">${req.message}</span>
                    </div>
                </div>
                <span class="request-item-time">${req.time}</span>
            </div>
        `).join('');
    }

    // Initial load of request list
    updateStudentRequestList();
}

// Initialize teacher page
function initTeacherPage() {
    const allRequestsContainer = document.getElementById('all-requests-container');

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
        
        // Sort by timestamp (newest first)
        const sortedRequests = [...allRequests].sort((a, b) => b.timestamp - a.timestamp);
        
        allRequestsContainer.innerHTML = sortedRequests.map(req => `
            <div class="teacher-request-item">
                <div class="teacher-request-icon">${req.icon}</div>
                <div class="teacher-request-content">
                    <div class="teacher-request-name">${req.studentName}</div>
                    <div class="teacher-request-message">${req.message}</div>
                </div>
                <div class="teacher-request-time">${req.time}</div>
            </div>
        `).join('');
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
