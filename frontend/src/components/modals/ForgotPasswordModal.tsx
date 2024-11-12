import React, { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';

interface ForgotPasswordModalProps {
  isVisible: boolean;
  onSubmit: (email: string) => Promise<{ error?: string } | undefined>;
  closeModal: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isVisible, onSubmit, closeModal }) => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      const result = await onSubmit(email);
      console.log(email, result);

      if (result?.error) {
        setError(result.error);
        toast.error('Failed to reset the password. Please try again.', {
          className: 'toast-custom',
        });
      } else {
        setSuccess(true);
        closeModal();
        setEmail('');
        toast.success('Please check your mail for resetting your password', {
          className: 'toast-custom',
        });
      }
    } catch (err) {
      setError('An error occurred while sending the reset link. Please try again.');
      toast.error('An error occurred. Please try again later.', {
        className: 'toast-custom',
      });
    }
  };

  return (
    <Modal isOpen={isVisible} onClose={closeModal}>
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      {success ? (
        <p className="text-green-500 text-sm mb-4">
          A password reset link has been sent to your email.
        </p>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter your email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="your@email.com"
              required
            />
          </div>
          <button onClick={handleSubmit} className="primary w-full mt-4">Send Reset Link</button>
          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
          >
            Cancel
          </button>
        </>
      )}
    </Modal>
  );
}

export default ForgotPasswordModal;
