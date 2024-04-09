import prisma from '@/app/lib/db';
import { useCountries } from '@/app/lib/getCountries';
import Image from 'next/image';
import Placeholder from '@/public/placeholder.jpg';
import { Separator } from '@/components/ui/separator';
import CategoryShowcase from '@/app/components/CategoryShowcase';
import HomeMap from '@/app/components/HomeMap';
import SelectCalendar from '@/app/components/SelectCalendar';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createReservation } from '@/app/actions';
import { ReservationSubmitButton } from '@/app/components/SubmitButtons';

async function getData(homeId: string) {
  const data = await prisma.home.findUnique({
    where: {
      id: homeId,
    },
    select: {
      photo: true,
      description: true,
      guests: true,
      bathrooms: true,
      bedrooms: true,
      title: true,
      categoryName: true,
      price: true,
      country: true,
      Reservation: {
        where: {
          homeId: homeId,
        },
      },
      User: {
        select: {
          profileImage: true,
          firstName: true,
        },
      },
    },
  });

  return data;
}

const SingleHomePage = async ({ params }: { params: { id: string } }) => {
  const data = await getData(params.id);

  const { getCountryByValue } = useCountries();

  const country = getCountryByValue(data?.country as string);

  const { getUser } = getKindeServerSession();

  const user = await getUser();

  return (
    <div className="w-[75%] mx-auto mt-10 mb-12">
      <h1 className="font-medium text-2xl mb-5">{data?.title}</h1>

      <div className="relative h-[550px]">
        <Image
          src={`https://wvqjkxisymovvcqmwxhn.supabase.co/storage/v1/object/public/images/${data?.photo}`}
          fill
          alt="home image"
          className="rounded-lg h-full object-cover w-full"
        />
      </div>

      <div className="flex justify-between gap-x-24 mt-8">
        <div className="w-2/3">
          <h3 className="text-xl font-medium">
            {country?.flag} {country?.label} / {country?.region}
          </h3>
          <div className="flex gap-x-2 text-muted-foreground">
            <p>{data?.guests} Guests</p> * <p>{data?.bedrooms}</p> Bedrooms *{' '}
            <p>{data?.bathrooms} Bathrooms</p>
          </div>

          <div className="flex items-center mt-6">
            <Image
              src={data?.User?.profileImage ?? Placeholder}
              alt="home owner avatar"
              className="w-11 h-11 rounded-full"
              width={44}
              height={44}
            />
            <div className="flex flex-col ml-4">
              <h3 className="font-medium">Hosted by {data?.User?.firstName}</h3>
              <p className="text-small text-muted-foreground">
                Certified host since 2022
              </p>
            </div>
          </div>

          <Separator className="my-7" />

          <CategoryShowcase categoryName={data?.categoryName as string} />

          <Separator className="my-7" />

          <p className="text-muted-foreground">{data?.description}</p>

          <Separator className="my-7" />

          <HomeMap locationValue={country?.value as string} />
        </div>

        <form action={createReservation}>
          <input type="hidden" name="homeId" value={params.id} />
          <input type="hidden" name="userId" value={user?.id} />

          <SelectCalendar reservation={data?.Reservation} />

          {user?.id ? (
            <ReservationSubmitButton />
          ) : (
            <Button className="w-full" asChild>
              <Link href="/api/auth/login">Make a reservation</Link>
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SingleHomePage;
