// SignIn.jsx - User sign-in page using Clerk

import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <ClerkSignIn 
          routing="path" 
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
};

export default SignIn;

