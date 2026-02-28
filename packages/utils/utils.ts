// app/components/Utils/utils.ts

// not perfect since if string starts with number NOT good.
export const isNumberCatto = (value?: string | number): boolean => {
  console.log('inside check for number value===', value);
  return value != null && value !== '' && !isNaN(Number(value.toString()));
};

export const getOrgFromURL = () => {
  console.log('inside getOrgFromURL ');
  const orgName = 'raton';
  return orgName;
};

// export const capitalizeFirstLetterCatto = (word: string) => {
export const capitalizeFirstLetterCatto = (word: string) => {
  const firstLetter = word.charAt(0);
  const firstLetterCap = firstLetter.toUpperCase();
  const remainingLetters = word.slice(1);
  const capitalizedWord = firstLetterCap + remainingLetters;
  return capitalizedWord;
  return word;
};

export const getOrgNameUrlCatto = (word: string) => {
  const lowerCaseOrgUrl = word.toLowerCase().replace(/ /g, '-');
  return lowerCaseOrgUrl;
};

export const getOrgNameFriendlyCatto = (word: string) => {
  return word;
};
