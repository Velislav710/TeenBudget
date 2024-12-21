import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RedirectReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/reset-password/${token}`);
  }, []);

  return null;
};

export default RedirectReset;
