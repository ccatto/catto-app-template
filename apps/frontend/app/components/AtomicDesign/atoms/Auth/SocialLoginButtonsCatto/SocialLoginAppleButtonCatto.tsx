'use client';

// import { FaApple } from 'react-icons/fa6';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn } from '@lib/auth-client-compat';

const SocialLoginAppleButtonCatto = () => {
  const handleAppleLogin = async () => {
    try {
      await signIn('apple', { callbackUrl: '/my-myapp' });
    } catch (_error) {}
  };

  return (
    <button
      className="flex w-full items-center justify-center rounded-full bg-gray-300 py-2 text-gray-700 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      onClick={handleAppleLogin}
    >
      <FontAwesomeIcon icon={faApple} className="mr-2" /> Sign in with Apple
    </button>
  );
};

export default SocialLoginAppleButtonCatto;

// import { useState } from 'react';
// import { Apple } from 'lucide-react';

// app/components/AtomicDesign/atoms/Auth/SocialLoginButtonsCatto/SocialLoginAppleButtonCatto.tsx

// interface SocialLoginAppleButtonCattoProps {
//   className?: string;
// }

// <button
//   className={`
//     flex items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200
//     ${className}
//   `}
//   onClick={handleAppleLogin}
// >
//   <Apple size={20} />
//   <span>Sign in with Apple</span>
// </button>
