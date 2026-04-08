// Project Tracking System
class ProjectTrackingSystem {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupEventListeners();
        this.renderProjects();
        this.updatePipelineCounts();
    }

    // Load projects from API or localStorage
    loadProjects() {
        // For now, load from localStorage - in production, this would be from API
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        this.projects = savedProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Save projects to localStorage
    saveProjects() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    // Setup event listeners
    setupEventListeners() {
        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.renderProjects();
            });
        }

        // Search
        const projectSearch = document.getElementById('projectSearch');
        if (projectSearch) {
            projectSearch.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderProjects();
            });
        }
    }

    // Render projects
    renderProjects() {
        this.renderPipeline();
        this.renderProjectsList();
    }

    // Render pipeline view
    renderPipeline() {
        const stages = ['quoted', 'in-progress', 'drying-curing', 'completed'];
        
        stages.forEach(status => {
            const stageProjects = this.projects.filter(project => project.status === status);
            const container = document.getElementById(`${status.replace('-', '')}Projects`);
            
            if (container) {
                container.innerHTML = '';
                
                stageProjects.forEach(project => {
                    const projectCard = this.createPipelineProjectCard(project);
                    container.appendChild(projectCard);
                });
            }
        });

        this.updatePipelineCounts();
    }

    // Create pipeline project card
    createPipelineProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'pipeline-project-card';
        card.dataset.projectId = project.id;

        card.innerHTML = `
            <div class="project-header">
                <h4>${project.name}</h4>
                <span class="project-order">#${project.orderNumber}</span>
            </div>
            <div class="project-details">
                <p><i class="fas fa-map-marker-alt"></i> ${project.address}</p>
                <p><i class="fas fa-calendar"></i> ${this.formatDate(project.createdAt)}</p>
            </div>
            <div class="project-value">
                <span class="value-amount">₹${project.total.toLocaleString('en-IN')}</span>
            </div>
            <div class="project-actions">
                <button class="btn btn-sm btn-outline" onclick="projectTracking.viewProjectDetails('${project.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="projectTracking.updateProjectStatus('${project.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;

        return card;
    }

    // Render projects list
    renderProjectsList() {
        const projectsList = document.getElementById('projectsList');
        const emptyProjects = document.getElementById('emptyProjects');

        if (!projectsList || !emptyProjects) return;

        let filteredProjects = this.projects;

        // Apply status filter
        if (this.currentFilter !== 'all') {
            filteredProjects = filteredProjects.filter(project => project.status === this.currentFilter);
        }

        // Apply search filter
        if (this.searchQuery) {
            filteredProjects = filteredProjects.filter(project =>
                project.name.toLowerCase().includes(this.searchQuery) ||
                project.address.toLowerCase().includes(this.searchQuery) ||
                project.orderNumber.toString().includes(this.searchQuery)
            );
        }

        if (filteredProjects.length === 0) {
            projectsList.style.display = 'none';
            emptyProjects.style.display = 'block';
            return;
        }

        projectsList.style.display = 'grid';
        emptyProjects.style.display = 'none';

        projectsList.innerHTML = '';

        filteredProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsList.appendChild(projectCard);
        });
    }

    // Create project card
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.projectId = project.id;

        const statusConfig = this.getStatusConfig(project.status);

        card.innerHTML = `
            <div class="project-header">
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <span class="project-order">Order #${project.orderNumber}</span>
                </div>
                <div class="project-status">
                    <span class="status-badge ${statusConfig.class}">${statusConfig.label}</span>
                </div>
            </div>

            <div class="project-content">
                <div class="project-details">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${project.address}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>Started: ${this.formatDate(project.createdAt)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Est. Completion: ${this.formatDate(project.estimatedCompletion)}</span>
                    </div>
                </div>

                <div class="project-progress">
                    <div class="progress-timeline">
                        ${this.createProgressTimeline(project.status)}
                    </div>
                </div>

                <div class="project-financials">
                    <div class="financial-item">
                        <span class="label">Project Value:</span>
                        <span class="value">₹${project.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="financial-item">
                        <span class="label">Materials:</span>
                        <span class="value">₹${project.materialCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="financial-item">
                        <span class="label">Labor:</span>
                        <span class="value">₹${project.laborCost.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div class="project-notes">
                    <h4>Latest Notes</h4>
                    <p>${project.latestNote || 'No notes available'}</p>
                </div>
            </div>

            <div class="project-actions">
                <button class="btn btn-outline" onclick="projectTracking.viewProjectDetails('${project.id}')">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
                <button class="btn btn-primary" onclick="projectTracking.updateProjectStatus('${project.id}')">
                    <i class="fas fa-edit"></i>
                    Update Status
                </button>
                <button class="btn btn-secondary" onclick="projectTracking.addNote('${project.id}')">
                    <i class="fas fa-sticky-note"></i>
                    Add Note
                </button>
            </div>
        `;

        return card;
    }

    // Get status configuration
    getStatusConfig(status) {
        const configs = {
            'quoted': { label: 'Quoted', class: 'status-quoted' },
            'in-progress': { label: 'In Progress', class: 'status-progress' },
            'drying-curing': { label: 'Drying/Curing', class: 'status-drying' },
            'completed': { label: 'Completed', class: 'status-completed' },
            'cancelled': { label: 'Cancelled', class: 'status-cancelled' }
        };
        
        return configs[status] || configs['quoted'];
    }

    // Create progress timeline
    createProgressTimeline(currentStatus) {
        const steps = [
            { key: 'quoted', label: 'Quote Sent', completed: true },
            { key: 'in-progress', label: 'Work Started', completed: ['in-progress', 'drying-curing', 'completed'].includes(currentStatus) },
            { key: 'drying-curing', label: 'Drying/Curing', completed: ['drying-curing', 'completed'].includes(currentStatus) },
            { key: 'completed', label: 'Completed', completed: currentStatus === 'completed' }
        ];

        return steps.map((step, index) => `
            <div class="timeline-step ${step.completed ? 'completed' : ''} ${step.key === currentStatus ? 'active' : ''}">
                <div class="step-dot"></div>
                <div class="step-label">${step.label}</div>
            </div>
        `).join('');
    }

    // Update pipeline counts
    updatePipelineCounts() {
        const stages = ['quoted', 'in-progress', 'drying-curing', 'completed'];
        
        stages.forEach(status => {
            const count = this.projects.filter(project => project.status === status).length;
            const countElement = document.getElementById(`${status.replace('-', '')}Count`);
            
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }

    // View project details
    viewProjectDetails(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const detailsContent = `
            <div class="project-details-modal">
                <div class="modal-header">
                    <h3>${project.name}</h3>
                    <span class="status-badge ${this.getStatusConfig(project.status).class}">
                        ${this.getStatusConfig(project.status).label}
                    </span>
                </div>

                <div class="modal-content">
                    <div class="details-section">
                        <h4>Project Information</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="label">Order Number:</span>
                                <span class="value">#${project.orderNumber}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Client:</span>
                                <span class="value">${project.clientName}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Contact:</span>
                                <span class="value">${project.clientPhone}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Email:</span>
                                <span class="value">${project.clientEmail}</span>
                            </div>
                        </div>
                    </div>

                    <div class="details-section">
                        <h4>Location</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="label">Address:</span>
                                <span class="value">${project.address}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">City:</span>
                                <span class="value">${project.city}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">State:</span>
                                <span class="value">${project.state}</span>
                            </div>
                        </div>
                    </div>

                    <div class="details-section">
                        <h4>Timeline</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="label">Started:</span>
                                <span class="value">${this.formatDate(project.createdAt)}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Est. Completion:</span>
                                <span class="value">${this.formatDate(project.estimatedCompletion)}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Last Updated:</span>
                                <span class="value">${this.formatDate(project.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="details-section">
                        <h4>Financial Summary</h4>
                        <div class="financial-summary">
                            <div class="summary-row">
                                <span>Project Value:</span>
                                <span>₹${project.total.toLocaleString('en-IN')}</span>
                            </div>
                            <div class="summary-row">
                                <span>Material Cost:</span>
                                <span>₹${project.materialCost.toLocaleString('en-IN')}</span>
                            </div>
                            <div class="summary-row">
                                <span>Labor Cost:</span>
                                <span>₹${project.laborCost.toLocaleString('en-IN')}</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total:</span>
                                <span>₹${project.total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div class="details-section">
                        <h4>Project Notes</h4>
                        <div class="notes-timeline">
                            ${project.notes ? project.notes.map(note => `
                                <div class="note-item">
                                    <div class="note-header">
                                        <span class="note-date">${this.formatDate(note.date)}</span>
                                        <span class="note-author">${note.author}</span>
                                    </div>
                                    <p class="note-content">${note.content}</p>
                                </div>
                            `).join('') : '<p>No notes available</p>'}
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="projectTracking.addNote('${project.id}')">
                        <i class="fas fa-sticky-note"></i>
                        Add Note
                    </button>
                    <button class="btn btn-primary" onclick="projectTracking.updateProjectStatus('${project.id}')">
                        <i class="fas fa-edit"></i>
                        Update Status
                    </button>
                    <button class="btn btn-secondary" onclick="closeModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        openModal(detailsContent, 'Project Details');
    }

    // Update project status
    updateProjectStatus(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const statusContent = `
            <div class="status-update-modal">
                <h3>Update Project Status</h3>
                <p>Order #${project.orderNumber} - ${project.name}</p>
                
                <form id="statusUpdateForm">
                    <div class="form-group">
                        <label class="form-label" for="newStatus">New Status *</label>
                        <select class="form-input" id="newStatus" name="newStatus" required>
                            <option value="">Select Status</option>
                            <option value="quoted">Quoted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="drying-curing">Drying/Curing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="statusNotes">Notes</label>
                        <textarea class="form-input" id="statusNotes" name="statusNotes" rows="4" placeholder="Add notes about this status update..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Status</button>
                    </div>
                </form>
            </div>
        `;

        openModal(statusContent, 'Update Status');

        // Setup form submission
        document.getElementById('statusUpdateForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processStatusUpdate(projectId, e.target);
        });
    }

    // Process status update
    processStatusUpdate(projectId, form) {
        const formData = new FormData(form);
        const newStatus = formData.get('newStatus');
        const notes = formData.get('statusNotes');

        // Update project
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.status = newStatus;
            project.updatedAt = new Date().toISOString();
            project.latestNote = notes;

            // Add to notes array
            if (!project.notes) {
                project.notes = [];
            }
            project.notes.push({
                date: new Date().toISOString(),
                author: 'System',
                content: `Status changed to ${this.getStatusConfig(newStatus).label}. ${notes}`
            });

            this.saveProjects();
            this.renderProjects();
            
            closeModal();
            showToast(`Project status updated to ${this.getStatusConfig(newStatus).label}`, 'success');
        }
    }

    // Add note to project
    addNote(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const noteContent = `
            <div class="add-note-modal">
                <h3>Add Project Note</h3>
                <p>Order #${project.orderNumber} - ${project.name}</p>
                
                <form id="addNoteForm">
                    <div class="form-group">
                        <label class="form-label" for="noteContent">Note *</label>
                        <textarea class="form-input" id="noteContent" name="noteContent" rows="4" required placeholder="Enter your note..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Note</button>
                    </div>
                </form>
            </div>
        `;

        openModal(noteContent, 'Add Note');

        // Setup form submission
        document.getElementById('addNoteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processAddNote(projectId, e.target);
        });
    }

    // Process adding note
    processAddNote(projectId, form) {
        const formData = new FormData(form);
        const noteContent = formData.get('noteContent');

        // Update project
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            if (!project.notes) {
                project.notes = [];
            }

            project.notes.push({
                date: new Date().toISOString(),
                author: auth.getCurrentUser()?.name || 'User',
                content: noteContent
            });

            project.latestNote = noteContent;
            project.updatedAt = new Date().toISOString();

            this.saveProjects();
            this.renderProjects();
            
            closeModal();
            showToast('Note added successfully', 'success');
        }
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Add sample projects for testing
    addSampleProjects() {
        const sampleProjects = [
            {
                id: 'proj_1',
                name: 'Master Bedroom Renovation',
                orderNumber: 100001,
                status: 'in-progress',
                clientName: 'Rahul Sharma',
                clientPhone: '+91 9876543210',
                clientEmail: 'rahul@example.com',
                address: '123 Park Avenue, Mumbai',
                city: 'Mumbai',
                state: 'Maharashtra',
                total: 45000,
                materialCost: 15000,
                laborCost: 30000,
                createdAt: '2024-01-15T10:00:00Z',
                estimatedCompletion: '2024-01-25T18:00:00Z',
                updatedAt: '2024-01-20T14:30:00Z',
                latestNote: 'Painting completed, now drying for 48 hours',
                notes: [
                    {
                        date: '2024-01-15T10:00:00Z',
                        author: 'System',
                        content: 'Project created and quote sent'
                    },
                    {
                        date: '2024-01-18T09:00:00Z',
                        author: 'Paint Team',
                        content: 'Started wall preparation and priming'
                    },
                    {
                        date: '2024-01-20T14:30:00Z',
                        author: 'Paint Team',
                        content: 'Painting completed, now drying for 48 hours'
                    }
                ]
            },
            {
                id: 'proj_2',
                name: 'Office Interior Painting',
                orderNumber: 100002,
                status: 'quoted',
                clientName: 'Priya Patel',
                clientPhone: '+91 9876543211',
                clientEmail: 'priya@example.com',
                address: '456 Business Park, Bangalore',
                city: 'Bangalore',
                state: 'Karnataka',
                total: 75000,
                materialCost: 25000,
                laborCost: 50000,
                createdAt: '2024-01-22T11:00:00Z',
                estimatedCompletion: '2024-02-05T18:00:00Z',
                updatedAt: '2024-01-22T11:00:00Z',
                latestNote: 'Quote sent to client, awaiting approval',
                notes: [
                    {
                        date: '2024-01-22T11:00:00Z',
                        author: 'System',
                        content: 'Quote sent to client, awaiting approval'
                    }
                ]
            },
            {
                id: 'proj_3',
                name: 'Exterior House Painting',
                orderNumber: 100003,
                status: 'completed',
                clientName: 'Amit Kumar',
                clientPhone: '+91 9876543212',
                clientEmail: 'amit@example.com',
                address: '789 Garden Road, Delhi',
                city: 'Delhi',
                state: 'Delhi',
                total: 120000,
                materialCost: 40000,
                laborCost: 80000,
                createdAt: '2024-01-05T09:00:00Z',
                estimatedCompletion: '2024-01-18T18:00:00Z',
                updatedAt: '2024-01-18T16:00:00Z',
                latestNote: 'Project completed successfully, client satisfied',
                notes: [
                    {
                        date: '2024-01-05T09:00:00Z',
                        author: 'System',
                        content: 'Project created and quote approved'
                    },
                    {
                        date: '2024-01-08T08:00:00Z',
                        author: 'Paint Team',
                        content: 'Started exterior preparation'
                    },
                    {
                        date: '2024-01-15T14:00:00Z',
                        author: 'Paint Team',
                        content: 'Painting completed, started curing process'
                    },
                    {
                        date: '2024-01-18T16:00:00Z',
                        author: 'System',
                        content: 'Project completed successfully, client satisfied'
                    }
                ]
            }
        ];

        this.projects = sampleProjects;
        this.saveProjects();
        this.renderProjects();
    }
}

// Initialize project tracking system
const projectTracking = new ProjectTrackingSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectTrackingSystem;
}
