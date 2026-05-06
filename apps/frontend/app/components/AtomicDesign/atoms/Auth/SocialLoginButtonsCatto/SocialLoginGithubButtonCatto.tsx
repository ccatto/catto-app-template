'use client';

import { useState } from 'react';
// import { FaGithub } from 'react-icons/fa';
import { LoadingMessageAndCircleCatto, MellowModalCatto } from '@ccatto/ui';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn } from '@lib/auth-client-compat';

const SocialLoginGithubButtonCatto = () => {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  return (
    <>
      <button
        className="dark:text-slate-850 flex w-full items-center justify-center rounded-full border-2 border-slate-600 bg-slate-500 py-2 text-slate-50 hover:scale-110 hover:bg-slate-600 dark:border-slate-400 dark:bg-slate-700 dark:hover:bg-slate-900"
        onClick={() => {
          setShowLoadingModal(true);
          signIn('github', {
            callbackUrl: process.env.NEXT_PUBLIC_BASE_URL + '/my-myapp',
          });
        }}
      >
        <FontAwesomeIcon icon={faGithub} className="mr-2" /> Sign in with Github
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

export default SocialLoginGithubButtonCatto;

// className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-slate-50 rounded-md px-4 py-2"
