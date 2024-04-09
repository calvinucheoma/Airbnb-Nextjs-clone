import Image from 'next/image';
import Link from 'next/link';
import { useCountries } from '../lib/getCountries';
import { AddToFavoriteButton, DeleteFromFavoriteButton } from './SubmitButtons';
import { addToFavorite, deleteFromFavorite } from '../actions';

interface CardProps {
  imagePath: string;
  description: string;
  location: string;
  price: number;
  userId: string | undefined;
  isInFavoriteList: boolean;
  favoriteId: string;
  homeId: string;
  pathname: string;
}

const ListingCard: React.FC<CardProps> = ({
  imagePath,
  description,
  location,
  price,
  userId,
  isInFavoriteList,
  favoriteId,
  homeId,
  pathname,
}) => {
  //   console.log(imagePath);

  const { getCountryByValue } = useCountries();

  const country = getCountryByValue(location);

  return (
    <div className="flex flex-col">
      <Link href={`/home/${homeId}`} className="mt-2 cursor-pointer">
        <div className="relative h-72">
          <Image
            src={`https://wvqjkxisymovvcqmwxhn.supabase.co/storage/v1/object/public/images/${imagePath}`}
            alt="house image"
            fill
            className="rounded-lg h-full object-cover"
          />

          {userId && (
            <div className="z-10 absolute top-2 right-2">
              {isInFavoriteList ? (
                <form action={deleteFromFavorite}>
                  <input type="hidden" name="favoriteId" value={favoriteId} />
                  <input type="hidden" name="userId" value={userId} />
                  <input type="hidden" name="pathname" value={pathname} />
                  <DeleteFromFavoriteButton />
                </form>
              ) : (
                <form action={addToFavorite}>
                  <input type="hidden" name="homeId" value={homeId} />
                  <input type="hidden" name="userId" value={userId} />
                  <input type="hidden" name="pathname" value={pathname} />
                  <AddToFavoriteButton />
                </form>
              )}
            </div>
          )}
        </div>

        <h3 className="font-medium text-base">
          {country?.flag} {country?.label} / {country?.region}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
        <p className="pt-2 text-muted-foreground">
          <span className="font-medium text-black">
            ₦{price.toLocaleString('en-NG')}
          </span>{' '}
          / night
        </p>
      </Link>
    </div>
  );
};

export default ListingCard;

/*
  The 'toLocaleString()' method in JavaScript is used to convert a number into a string using a locale-specific format. 
  It allows you to specify the locale and additional options for formatting, such as the number of decimal places, thousands separator, 
  and currency symbol.

  You can also customize the formatting further by passing additional options to 'toLocaleString()', such as specifying the currency, 
  minimum and maximum number of fraction digits, and more.
*/
