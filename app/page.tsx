import { Suspense } from 'react';
import ListingCard from './components/ListingCard';
import MapFilterItems from './components/MapFilterItems';
import prisma from './lib/db';
import SkeletonCard from './components/SkeletonCard';
import NoItem from './components/NoItem';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

/************************FETCH DATA FROM DATABASE FUNCTION ***************************************/
async function getData({
  searchParams,
  userId,
}: {
  userId: string | undefined;
  searchParams?: {
    filter?: string;
    country?: string;
    guest?: string;
    room?: string;
    bathroom?: string;
  };
}) {
  const data = await prisma.home.findMany({
    where: {
      addedCategory: true,
      addedLocation: true,
      addedDescription: true,
      categoryName: searchParams?.filter ?? undefined,
      country: searchParams?.country ?? undefined,
      guests: searchParams?.guest ?? undefined,
      bedrooms: searchParams?.room ?? undefined,
      bathrooms: searchParams?.bathroom ?? undefined,
      // if it is undefined, prisma would behave as if it did not see this 'where' statement and continue with the other codes
    },
    select: {
      photo: true,
      id: true,
      price: true,
      description: true,
      country: true,
      favorite: {
        where: {
          userId: userId ?? undefined,
        },
      },
    },
  });

  return data;
}

/************************ HOME PAGE ***************************************/

export default function Home({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
    country?: string;
    guest?: string;
    room?: string;
    bathroom?: string;
  };
}) {
  return (
    <div className="container mx-auto px-5 lg:px-10">
      <MapFilterItems />

      <Suspense fallback={<SkeletonLoading />} key={searchParams?.filter}>
        <ShowItems searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

/************************ FUNCTION TO DISPLAY THE FETCHED DATA FROM DATABASE ***********************************/

async function ShowItems({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
    country?: string;
    guest?: string;
    room?: string;
    bathroom?: string;
  };
}) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  const data = await getData({ searchParams: searchParams, userId: user?.id });

  return (
    <>
      {data.length === 0 ? (
        <NoItem
          title="Sorry, no listings found for this category..."
          description="Please check another category or create your own listing"
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.id}
              imagePath={item.photo as string}
              description={item.description as string}
              price={item.price as number}
              location={item.country as string}
              userId={user?.id}
              isInFavoriteList={item.favorite.length > 0 ? true : false}
              favoriteId={item.favorite[0]?.id}
              homeId={item.id}
              pathname="/"
            />
          ))}
        </div>
      )}
    </>
  );
}

/************************ FALLBACK LOADING STATE TO DISPLAY WHEN DATA IS FETCHING *******************************/

function SkeletonLoading() {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

// We give our Suspense component a unique key using 'searchParams?.filter' so it always loads for each key
