// Resume Management System
class ResumeManager {
    constructor() {
        this.resumes = JSON.parse(localStorage.getItem('resumes')) || [];
        this.editingIndex = null;
        this.currentImage = 'images/default-avatar.png';
        
        this.initializeEventListeners();
        this.renderResumes();
    }

    initializeEventListeners() {
        document.getElementById('resumeForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.cancelEdit());
        
        // Image upload handling
        document.getElementById('imageUpload').addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Click on image preview to trigger file input
        document.getElementById('imagePreview').addEventListener('click', () => {
            document.getElementById('imageUpload').click();
        });
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                this.currentImage = e.target.result;
                this.updateImagePreview();
            };
            
            reader.readAsDataURL(file);
        }
    }

    updateImagePreview() {
        const preview = document.getElementById('previewImage');
        const previewContainer = document.getElementById('imagePreview');
        
        preview.src = this.currentImage;
        previewContainer.classList.add('has-image');
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const resume = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            education: document.getElementById('education').value,
            skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
            experience: document.getElementById('experience').value.split('\n').filter(exp => exp.trim()),
            image: this.currentImage
        };

        if (this.editingIndex !== null) {
            // Update existing resume
            this.resumes[this.editingIndex] = resume;
            this.editingIndex = null;
            document.getElementById('submitBtn').textContent = 'Add Resume';
            document.getElementById('cancelBtn').style.display = 'none';
        } else {
            // Add new resume
            this.resumes.push(resume);
        }

        this.saveToLocalStorage();
        this.renderResumes();
        this.resetForm();
    }

    editResume(index) {
        const resume = this.resumes[index];
        
        document.getElementById('name').value = resume.name;
        document.getElementById('email').value = resume.email;
        document.getElementById('phone').value = resume.phone;
        document.getElementById('education').value = resume.education;
        document.getElementById('skills').value = resume.skills.join(', ');
        document.getElementById('experience').value = resume.experience.join('\n');
        
        this.currentImage = resume.image;
        this.updateImagePreview();
        
        this.editingIndex = index;
        document.getElementById('submitBtn').textContent = 'Update Resume';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        // Scroll to form
        document.querySelector('.resume-form').scrollIntoView({ behavior: 'smooth' });
    }

    deleteResume(index) {
        if (confirm('Are you sure you want to delete this resume?')) {
            this.resumes.splice(index, 1);
            this.saveToLocalStorage();
            this.renderResumes();
        }
    }

    cancelEdit() {
        this.editingIndex = null;
        this.currentImage = 'images/default-avatar.png';
        this.updateImagePreview();
        document.getElementById('submitBtn').textContent = 'Add Resume';
        document.getElementById('cancelBtn').style.display = 'none';
        this.resetForm();
    }

    resetForm() {
        document.getElementById('resumeForm').reset();
        this.currentImage = 'images/default-avatar.png';
        this.updateImagePreview();
        document.getElementById('imagePreview').classList.remove('has-image');
    }

    saveToLocalStorage() {
        localStorage.setItem('resumes', JSON.stringify(this.resumes));
    }

    renderResumes() {
        const container = document.getElementById('resumesContainer');
        
        if (this.resumes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Resumes Yet</h3>
                    <p>Add your first resume using the form on the left!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.resumes.map((resume, index) => `
            <div class="resume-card">
                <div class="resume-header">
                    <img src="${resume.image}" alt="${resume.name}" class="resume-avatar" onerror="this.src='images/default-avatar.png'">
                    <div class="resume-info">
                        <div class="resume-name">${resume.name}</div>
                        <div class="resume-contact">
                            ${resume.email} • ${resume.phone}
                        </div>
                    </div>
                </div>
                
                <div class="resume-section">
                    <h4>Education</h4>
                    <p>${resume.education}</p>
                </div>
                
                <div class="resume-section">
                    <h4>Skills</h4>
                    <div class="skills-list">
                        ${resume.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                
                <div class="resume-section">
                    <h4>Work Experience</h4>
                    ${resume.experience.map(exp => `<div class="experience-item">${exp}</div>`).join('')}
                </div>
                
                <div class="resume-actions">
                    <button class="edit-btn" onclick="resumeManager.editResume(${index})">Edit</button>
                    <button class="delete-btn" onclick="resumeManager.deleteResume(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize the resume manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const resumeManager = new ResumeManager();
    window.resumeManager = resumeManager; // Make it globally available
});