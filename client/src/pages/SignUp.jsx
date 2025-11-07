// SignUp.jsx - User registration page using Clerk

import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

const SignUp = () => {
  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <ClerkSignUp 
          routing="path" 
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  );
};

export default SignUp;

