'use client';
import Link from 'next/link';
import { categoryItems } from '../lib/categoryItems';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

const MapFilterItems = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get('filter');

  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      // This line creates a new URLSearchParams object from the current search parameters obtained from the URL.
      // The 'URLSearchParams.toString()' method generates a URL-encoded string representation of the parameters
      // stored in the 'URLSearchParams' object. It doesn't change the original object but produces a string based
      // on its current state.

      params.set(name, value);
      // This line sets or updates the value of the specified parameter ('name') with the provided value ('value')

      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex gap-x-10 mt-5 w-full overflow-x-scroll no-scrollbar justify-around">
      {categoryItems.map((item) => (
        <Link
          href={pathname + '?' + createQueryString('filter', item.name)}
          key={item.id}
          className={cn(
            search === item.name
              ? 'border-b-2 border-black pb-2 flex-shrink-0'
              : 'opacity-70 flex-shrink-0',
            'flex flex-col gap-y-3 items-center hover:underline'
          )}
        >
          <div className="relative w-6 h-6">
            <Image
              src={item.imageUrl}
              alt={item.name}
              className="w-6 h-6"
              width={24}
              height={24}
            />
          </div>
          <p className="text-xs font-medium">{item.title}</p>
        </Link>
      ))}
    </div>
  );
};

export default MapFilterItems;

/*
  Using this method also works:
          <Link
          href={pathname + '?' + 'filter=' + item.name}
          key={item.id}
          className={cn(search === item.name)}
        >
  Both approaches achieve the same result of constructing the URL with the 'filter' parameter set to 'item.name'.

  In this other version, I directly concatenate the 'filter=' string with 'item.name' to construct the query string
  for the 'href' attribute of the 'Link' component. This approach is simpler and achieves the same result as using
  the 'createQueryString' function. However, if you have more complex URL parameter handling or need to handle 
  special characters properly, using the 'createQueryString' function might be more robust and maintainable. 
  Ultimately, both approaches are valid, and you can choose the one that suits your preference and requirements.
*/

/*

  Let's say you have a URL like this: 'https://example.com/?category=electronics&page=1'.

  When you call 'useSearchParams()' in your Next.js component, it will return an object representing the search 
  parameters of the current URL. In this case:

      const searchParams = useSearchParams();
        // searchParams = {
        //   category: 'electronics',
        //   page: '1'
        // }

  Now, let's assume you want to create a new query string where you add or update the 'filter' parameter. 
  You can use the 'createQueryString' function you defined.

  For example, let's say you have an item with the name 'laptops' and you want to generate a new URL with the 
  'filter' parameter set to 'laptops'. When you call 'createQueryString('filter', 'laptops')', it will modify the 
  existing query string (if any) to include the 'filter' parameter with the value 'laptops'.

  const newQueryString = createQueryString('filter', 'laptops');
  // newQueryString = "?category=electronics&page=1&filter=laptops"

  So, 'newQueryString' now contains the updated query string with the 'filter' parameter added. 
  This is achieved by first converting the 'searchParams' object to a string using 'searchParams.toString()', 
  then modifying this string to include the additional query parameter specified by 'name' ('filter') and 
  'value' ('laptops'). Finally, it returns the updated query string.
*/

/*

  When you call 'URLSearchParams.set(name, value)' to set parameters in the 'URLSearchParams' object, 
  it automatically updates the internal state of the object to include those parameters. Then, when you call 
  'URLSearchParams.toString()', it generates a string representation of the parameters stored in the object 
  according to the URL query string format.

  So, after you've set parameters using 'URLSearchParams.set(name, value)', the 'URLSearchParams.toString()' method
  generates a string by concatenating each parameter name and value pair, separated by "&", and adding a "?" at the
  beginning to denote the start of the query string.

  In summary, 'URLSearchParams.toString()' internally converts the parameters stored in the object into a formatted
  string representation that follows the standard URL query string syntax.

  If you log 'params.toString()' and 'params' directly to the console, you will see different representations.

  •'params.toString()': This will return a string representing the parameters stored in the URLSearchParams object,
   following the URL query string format. For example, if params contains parameters like 
   { category: 'electronics', page: '1', filter: 'laptops' }, calling 'params.toString()' will return 
   "category=electronics&page=1&filter=laptops".

  •'params as a stand-alone': When you log 'params' directly, you will see the 'URLSearchParams' object itself, 
    not its string representation. This means you will see something like '[object URLSearchParams]' or an object 
    representation depending on your console.

  In summary, 'params.toString()' will give you a string representation of the parameters suitable for a URL query
  string, while logging 'params' directly will show you the object itself.

*/

/*

  'URLSearchParams.toString()' works differently compared to 'toString()' methods on regular objects, strings, or 
   numbers. When called on an instance of 'URLSearchParams', 'toString()' doesn't just return the object instance;
   instead, it returns a string representation of the parameters stored in the object following the URL query string format.

  If you did not call '.toString()' explicitly in your 'createQueryString' function and instead returned the 
  'params' object directly, you would still get the desired behavior. This is because when you concatenate the 
  'params' object with other strings (like pathname + '?' + createQueryString('filter', item.name)), JavaScript 
  automatically calls the 'toString()' method on the 'params' object to convert it to a string representation.

  So, whether you explicitly call '.toString()' or not, the 'params' object will be converted to a string 
  representation when used in a string context (like concatenation with other strings). Therefore, in my case, 
  I could omit '.toString()' in your 'createQueryString' function, and it would still work as expected.







*/
