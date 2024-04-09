import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '../lib/db';
import { redirect } from 'next/navigation';
import NoItem from '../components/NoItem';
import ListingCard from '../components/ListingCard';

async function getData(userId: string) {
  const data = await prisma.home.findMany({
    where: {
      userId: userId,
      addedCategory: true,
      addedDescription: true,
      addedLocation: true,
    },
    select: {
      id: true,
      country: true,
      photo: true,
      description: true,
      price: true,
      favorite: {
        where: {
          userId: userId,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return data;
}

const MyHomesPage = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    return redirect('/');
  }

  const data = await getData(user.id);

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Homes</h2>

      {data.length === 0 ? (
        <NoItem
          title="You do not have any homes listed yet"
          description="Please list a home on airbnb so you can view it here"
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.id}
              description={item.description as string}
              location={item.country as string}
              pathname="/favorites"
              homeId={item.id as string}
              imagePath={item.photo as string}
              price={item.price as number}
              userId={user.id}
              favoriteId={item.favorite[0]?.id}
              isInFavoriteList={item.favorite.length > 0 ? true : false}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MyHomesPage;
