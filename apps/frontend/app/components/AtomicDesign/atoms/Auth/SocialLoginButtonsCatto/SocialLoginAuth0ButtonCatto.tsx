'use client';

import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { SiAuth0 } from 'react-icons/si';
import { signIn } from '@lib/auth-client-compat';

const SocialLoginAuth0ButtonCatto = () => {
  return (
    <button
      className="flex w-full max-w-sm items-center justify-center gap-2 rounded-full border-2 border-slate-900 bg-slate-500 px-6 py-2.5 text-base font-medium text-slate-50 transition-colors duration-200 hover:scale-110 hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 focus:outline-hidden dark:border-slate-500 dark:bg-slate-950 dark:hover:bg-gray-700"
      onClick={() =>
        signIn('auth0', {
          callbackUrl: process.env.NEXT_PUBLIC_BASE_URL + '/my-myapp',
        })
      }
    >
      {/* <SiAuth0 className="mr-2" /> */}
      <FontAwesomeIcon icon={faShieldAlt} className="mr-2" /> Sign in with Auth0
    </button>
  );
};

export default SocialLoginAuth0ButtonCatto;
