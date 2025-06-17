import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<{ email: string; id: number; created_at: string } | null>(null);
  const navigate = useNavigate();

  const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:3001/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch(() => {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    // localStorage.removeItem('token');
    navigate('/');
  };

  if (!profile) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
      <h2 className="profile-title">My Profile</h2>
      <div className="profile-row">
        <span className="profile-label">Email:</span>
        <span className="profile-value">{profile.email}</span>
      </div>
      <div className="profile-row">
        <span className="profile-label">Created At:</span>
        <span className="profile-value">{formatDate(profile.created_at)}</span>
      </div>
      <button className="profile-logout" onClick={handleLogout}>Back to Home</button>
    </div>
    </div>
  );
};

export default Profile;
