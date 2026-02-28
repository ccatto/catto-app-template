'use client';

import { useState } from 'react';
// import { FaGoogle } from 'react-icons/fa';
import { LoadingMessageAndCircleCatto, MellowModalCatto } from '@catto/ui';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn } from '@lib/auth-client-compat';

// //  /auth/SocialLoginGoogleButtonCatto.tsx

export default function SocialLoginGoogleButtonCatto() {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  return (
    <>
      {/* <div className="md:mt-8"></div> */}
      <button
        className="flex w-full items-center justify-center rounded-full border-2 border-blue-900 bg-blue-500 py-2 font-medium text-slate-50 hover:scale-110 hover:bg-blue-400 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-700"
        onClick={() => {
          setShowLoadingModal(true);
          signIn('google', {
            callbackUrl: process.env.NEXT_PUBLIC_BASE_URL + '/my-myapp',
          });
        }}
      >
        <FontAwesomeIcon icon={faGoogle} className="mr-2" /> Sign in with Google
      </button>
      <MellowModalCatto
        isOpen={showLoadingModal}
        onClose={() => setShowLoadingModal(false)}
        title="Submitting"
        theme="midnightEmber"
        size="sm"
        position="center"
        closeOnEscape={false}
        closeOnOutsideClick={false}
        preventScroll={true}
      >
        <LoadingMessageAndCircleCatto />
      </MellowModalCatto>
    </>
  );
}
