import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get('token');
    if (tokenFromURL) {
      setToken(tokenFromURL);
      setShowModal(true); 
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/resetPassword', {
        token,
        newPassword,
      });

      if (res.data) {
        setSuccess(true);
        toast.success('Password Reset Success', {
          className: 'toast-custom'
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('Failed to reset password. The link may be invalid or expired.');
      console.error(err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <Modal isOpen={showModal} onClose={handleClose}>
      <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
        <h1>Reset Password</h1>
        {error && <p className="text-red-500">{error}</p>}
        {success ? (
          <p>Password reset successfully! Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="primary w-full mt-4">Reset Password</button>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default ResetPassword;
