'use client';

import SocialLoginAuth0ButtonCatto from './SocialLoginAuth0ButtonCatto';
import SocialLoginFacebookButtonCatto from './SocialLoginFacebookButtonCatto';
import SocialLoginGithubButtonCatto from './SocialLoginGithubButtonCatto';
import LoginButtonGoogleCatto from './SocialLoginGoogleButtonCatto';

const LoginSocialButtonsCatto = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 py-4">
      <LoginButtonGoogleCatto />
      <SocialLoginFacebookButtonCatto />
      <SocialLoginGithubButtonCatto />
      {/* Hidden for now - uncomment to re-enable Auth0 login
      <SocialLoginAuth0ButtonCatto />
      */}
    </div>
  );
};

export default LoginSocialButtonsCatto;

//        _
//   _,_ //  __/      __   _,_ ,____,   ,____,   _   ,__,  -/- ,
// _(_/_(/__(_/(_   _(_,__(_/_/ / / (__/ / / (__(/__/ / (__/__/_)_
//
// // // import SocialLoginAppleButtonCatto from '../SocialLoginAppleButtonCatto/SocialLoginAppleButtonCatto';
//         {/* <div className="mt-8">
//           <SocialLoginAppleButtonCatto />
//         </div> */}

// );
// {/* <div className="md:mt-8"> */}
