import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Resetbasic = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Паролите не съвпадат');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Паролата е променена успешно!');
        navigate('/login');
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message || 'Възникна грешка при смяната на паролата');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-yellow-300 to-amber-400">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Промяна на парола</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Нова парола"
            className="w-full p-3 mb-4 border rounded-xl"
            required
          />
          
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Потвърди новата парола"
            className="w-full p-3 mb-4 border rounded-xl"
            required
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Изпращане...' : 'Промени паролата'}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Resetbasic;

