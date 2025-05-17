import { useState, useEffect } from 'react';
import { Calendar, Clock, Building, FileText, Briefcase, CheckCircle, X } from 'lucide-react';
import '../Joblist.css';

const Application = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobSource: '',
    applicationDate: '',
    jobStatus: 'Applied',
    followUpDate: '',
    followUpCompleted: false,
    jobDescription: '',
    notes: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  // Load applications from localStorage on component mount
  useEffect(() => {
    const savedApplications = localStorage.getItem('jobApplications');
    if (savedApplications) {
      try {
        const parsedApplications = JSON.parse(savedApplications);
        if (Array.isArray(parsedApplications)) {
          setApplications(parsedApplications);
        }
      } catch (error) {
        console.error('Failed to parse saved applications', error);
        // Initialize with empty array if corrupted data
        localStorage.setItem('jobApplications', JSON.stringify([]));
      }
    }
  }, []);

  // Save applications to localStorage whenever applications change
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('jobApplications', JSON.stringify(applications));
    }, 100);
    return () => clearTimeout(timer);
  }, [applications]);

  const openModal = () => {
    setFormData({
      jobTitle: '',
      companyName: '',
      jobSource: '',
      applicationDate: new Date().toISOString().split('T')[0],
      jobStatus: 'Applied',
      followUpDate: '',
      followUpCompleted: false,
      jobDescription: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.companyName || !formData.applicationDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newApplication = {
      ...formData,
      id: Date.now().toString(), // Unique ID based on timestamp
      createdAt: new Date().toISOString() // Track creation time
    };
    
    setApplications(prev => [...prev, newApplication]);
    closeModal();
  };

  const confirmDelete = (id) => {
    setApplicationToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    setApplications(prev => prev.filter(app => app.id !== applicationToDelete));
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'status-applied';
      case 'Interview': return 'status-interview';
      case 'Offer': return 'status-offer';
      case 'Rejected': return 'status-rejected';
      default: return 'status-default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="application-container">
      <div className="main-content">
        <div className="controls">
          <button onClick={openModal} className="add-button">
            Add Application
          </button>
        </div>

        <div className="applications-grid">
          {applications.map(app => (
            <div key={app.id} className="application-card">
              <div className="card-top-section">
                <div className="title-section">
                  <h3 className="job-title">{app.jobTitle}</h3>
                  <div className="company-info">
                    <Building className="icon" />
                    <span className="company-name">{app.companyName}</span>
                  </div>
                </div>
                <div className={`status-badge ${getStatusColor(app.jobStatus)}`}>
                  {app.jobStatus}
                </div>
              </div>
              
              <div className="card-details">
                <div className="detail-item">
                  <FileText className="icon" />
                  <span>Source: {app.jobSource || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <Calendar className="icon" />
                  <span>Applied: {formatDate(app.applicationDate)}</span>
                </div>
              </div>
              <div className="card-bottom-section">
                {app.followUpDate && (
                  <div className="follow-up-item">
                    <Clock className="icon follow-up" />
                    <span className={app.followUpCompleted ? "completed" : ""}>
                      Follow-up: {formatDate(app.followUpDate)}
                    </span>
                    {app.followUpCompleted && (
                      <CheckCircle className="completed-icon" />
                    )}
                  </div>
                )}
                <button 
                  onClick={() => confirmDelete(app.id)} 
                  className="delete-button"
                  aria-label="Delete"
                  title="Delete"
                >
                  <X className="icon" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Briefcase className="icon" />
            </div>
            <h3>No applications yet</h3>
            <p>Start tracking your job applications today</p>
            <button onClick={openModal} className="add-button">
              Add Your First Application
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>Confirm Deletion</h2>
              <button onClick={cancelDelete} className="close-button" aria-label="Close">
                <X className="icon" />
              </button>
            </div>
            <div className="modal-form">
              <p>Are you sure you want to delete this application? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleDelete} className="submit-button delete-confirm-button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Application Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>Add New Application</h2>
              <button onClick={closeModal} className="close-button" aria-label="Close">
                <X className="icon" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="jobTitle" className="form-label">
                  Job Title*
                </label>
                <input 
                  type="text" 
                  id="jobTitle" 
                  value={formData.jobTitle} 
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="companyName" className="form-label">
                  Company Name*
                </label>
                <input 
                  type="text" 
                  id="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Google"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="jobSource" className="form-label">
                  Source
                </label>
                <select 
                  id="jobSource" 
                  value={formData.jobSource} 
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Source</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Company Website">Company Website</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="applicationDate" className="form-label">
                    Application Date*
                  </label>
                  <input 
                    type="date" 
                    id="applicationDate" 
                    value={formData.applicationDate} 
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="jobStatus" className="form-label">
                    Status*
                  </label>
                  <select 
                    id="jobStatus" 
                    value={formData.jobStatus} 
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="jobDescription" className="form-label">
                  Job Description
                </label>
                <textarea 
                  id="jobDescription" 
                  value={formData.jobDescription} 
                  onChange={handleChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="Paste the job description here..."
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea 
                  id="notes" 
                  value={formData.notes} 
                  onChange={handleChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="Add any additional notes..."
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Application;