import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        const response = true; // Mocked response for testing

        if (response) {
          setVerificationStatus('success');
          setMessage('User verified successfully!');
        } else {
          setVerificationStatus('error');
          setMessage('Verification failed. Please try again or contact support.');
        }
      } catch (error) {
        setVerificationStatus('error');
        setMessage('An error occurred during verification. Please try again later.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">User Verification</h1>
        {verificationStatus === 'loading' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Verifying your account...</p>
          </div>
        )}
        {verificationStatus === 'success' && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p className="font-bold">Success</p>
            <p>{message}</p>
          </div>
        )}
        {verificationStatus === 'error' && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{message}</p>
          </div>
        )}
        {verificationStatus === 'success' && (
          <div className="mt-6 text-center">
            <Link to="/signin">
              <span className="font-bold text-purple-600 hover:text-purple-500">Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
