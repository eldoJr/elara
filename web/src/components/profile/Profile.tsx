import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';

interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  date_of_birth: string | null;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    date_of_birth: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile/');
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('/api/profile/update/', profile);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" className="py-16">
      <div className="card spacing-lg">
        <h1 className="text-heading-1 text-primary text-center mb-6">
          My Profile
        </h1>
        
        {message && (
          <Alert severity={message.includes('Error') ? 'error' : 'success'} className="mb-4">
            {message}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={profile.username}
              disabled
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={profile.date_of_birth || ''}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          
          <TextField
            fullWidth
            label="Address"
            name="address"
            multiline
            rows={3}
            value={profile.address}
            onChange={handleChange}
            margin="normal"
          />
          
          <button
            type="submit"
            className="button-primary w-full mt-6"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </Container>
  );
};

export default Profile;