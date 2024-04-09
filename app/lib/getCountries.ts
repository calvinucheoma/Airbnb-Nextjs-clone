import countries from 'world-countries';

const countriesFormatted = countries.map((item) => ({
  value: item.cca2,
  label: item.name.common,
  flag: item.flag,
  latLang: item.latlng,
  region: item.region,
}));

export const useCountries = () => {
  const getAllCountries = () => countriesFormatted;

  const getCountryByValue = (value: string) => {
    return countriesFormatted.find((item) => item.value === value);
  };

  return {
    getAllCountries,
    getCountryByValue,
  };
};

/*
  The 'find' method returns a single value (the first element that satisfies the condition) or 'undefined' if no 
  such element is found. Therefore, you cannot use array methods directly on the value returned by 'find', as it's
  not an array. On the other hand, the 'filter' method always returns an array, so you can use array methods on 
  its result.
  
*/
