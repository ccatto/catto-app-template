'use client';

import { useState } from 'react';
// import { FaFacebookF } from 'react-icons/fa';
import { LoadingMessageAndCircleCatto, MellowModalCatto } from '@catto/ui';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn } from '@lib/auth-client-compat';

const SocialLoginFacebookButtonCatto = () => {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  return (
    <>
      <button
        className="dark:text-slate-850 flex w-full items-center justify-center rounded-full border-2 border-blue-900 bg-blue-400 py-2 font-medium text-slate-50 hover:scale-110 hover:bg-blue-600 dark:border-blue-400 dark:bg-blue-600 dark:hover:bg-blue-800"
        onClick={() => {
          setShowLoadingModal(true);
          signIn('facebook', {
            callbackUrl: process.env.NEXT_PUBLIC_BASE_URL + '/my-myapp',
          });
        }}
      >
        <FontAwesomeIcon icon={faFacebookF} className="mr-2" /> Sign in with
        Facebook
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
};

export default SocialLoginFacebookButtonCatto;
