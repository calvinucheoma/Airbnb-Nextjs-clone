import { redirect } from 'next/navigation';
import prisma from '../lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import NoItem from '../components/NoItem';
import ListingCard from '../components/ListingCard';

async function getData(userId: string) {
  const data = await prisma.favorite.findMany({
    where: {
      userId: userId,
    },
    select: {
      Home: {
        select: {
          photo: true,
          id: true,
          favorite: true,
          price: true,
          country: true,
          description: true,
        },
      },
    },
  });

  return data;
}

const FavoritePage = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    return redirect('/');
  }

  const data = await getData(user.id);

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Favorites</h2>

      {data.length === 0 ? (
        <NoItem
          title="You do not have any favorites yet"
          description="Please add some houses to your favorites to see them here"
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.Home?.id}
              description={item.Home?.description as string}
              location={item.Home?.country as string}
              pathname="/favorites"
              homeId={item.Home?.id as string}
              imagePath={item.Home?.photo as string}
              price={item.Home?.price as number}
              userId={user.id}
              favoriteId={item.Home?.favorite[0].id as string}
              isInFavoriteList={
                (item.Home?.favorite.length as number) > 0 ? true : false
              }
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FavoritePage;