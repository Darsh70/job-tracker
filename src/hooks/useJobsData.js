import { useState, useEffect } from 'react';

export function useJobsData() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const calculateDaysSince = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const fetchJobs = () => {
    fetch('http://localhost:5001/getJobs')
      .then(response => response.json())
      .then(data => {
        const jobsWithId = data.map((job, index) => ({
          id: index,
          ...job,
          daysSinceApplied: job.date ? calculateDaysSince(job.date) : null
        }));
        setJobs(jobsWithId);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  };

  const deleteJobs = (selectedIds) => {
    fetch('http://localhost:5001/deleteJobs', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ids: selectedIds})
    })
      .then(response => response.json())
      .then(() => {
        setJobs(prevJobs => prevJobs.filter(job => !selectedIds.includes(job.id)));
      })
      .catch(error => console.error('Error deleting jobs:', error));
  };
  
  const updateJobStatus = (jobId, job, newStatus) => {
    setJobs(prevJobs =>
      prevJobs.map(j =>
        j.id === jobId ? { ...j, status: newStatus } : j
      )
    );
    fetch('http://localhost:5001/updateStatus', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        status: newStatus,
        url: job.link
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update job status');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error updating job status:', error);
        fetchJobs();
      });
  };
  
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);
  
  return { jobs, loading, updateJobStatus, deleteJobs };
}