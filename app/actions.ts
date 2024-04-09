'use server';

import { redirect } from 'next/navigation';
import prisma from './lib/db';
import { supabase } from './lib/superbase';
import { revalidatePath } from 'next/cache';

export const createAirbnbHome = async ({ userId }: { userId: string }) => {
  const data = await prisma.home.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (data === null) {
    const data = await prisma.home.create({
      data: {
        userId: userId,
      },
    });

    return redirect(`/create/${data.id}/structure`);
  } else if (
    !data.addedCategory &&
    !data.addedDescription &&
    !data.addedLocation
  ) {
    return redirect(`/create/${data.id}/structure`);
  } else if (
    data.addedCategory &&
    !data.addedDescription &&
    !data.addedLocation
  ) {
    return redirect(`/create/${data.id}/description`);
  } else if (
    data.addedCategory &&
    data.addedDescription &&
    !data.addedLocation
  ) {
    return redirect(`/create/${data.id}/address`);
  } else if (
    data.addedCategory &&
    data.addedDescription &&
    data.addedLocation
  ) {
    const data = await prisma.home.create({
      data: {
        userId: userId,
      },
    });

    return redirect(`/create/${data.id}/structure`);
  }
};

export const createCategoryPage = async (formData: FormData) => {
  const categoryName = formData.get('categoryName') as string;
  const homeId = formData.get('homeId') as string;

  const data = await prisma.home.update({
    where: {
      id: homeId,
    },
    data: {
      categoryName: categoryName,
      addedCategory: true,
    },
  });

  return redirect(`/create/${homeId}/description`);
};

export const createDescription = async (formData: FormData) => {
  const title = formData.get('title') as string;

  const description = formData.get('description') as string;

  const price = formData.get('price');

  const imageFile = formData.get('image') as File;

  const guestNumber = formData.get('guest') as string;

  const roomNumber = formData.get('room') as string;

  const bathroomNumber = formData.get('bathroom') as string;

  const homeId = formData.get('homeId') as string;

  const { data: imageData } = await supabase.storage
    .from('images')
    .upload(`${imageFile.name}-${new Date()}`, imageFile, {
      cacheControl: '2592000', // we tell supabase how long we want to cache our images here. Here we cache our images for 1 year
      contentType: 'image/png',
    });
  // we named our created storage bucket in supabase, 'images'

  const data = await prisma.home.update({
    where: {
      id: homeId,
    },
    data: {
      title: title,
      description: description,
      price: Number(price),
      photo: imageData?.path,
      guests: guestNumber,
      bedrooms: roomNumber,
      bathrooms: bathroomNumber,
      addedDescription: true,
    },
  });

  return redirect(`/create/${homeId}/address`);
};

export const createLocation = async (formData: FormData) => {
  const homeId = formData.get('homeId') as string;

  const countryValue = formData.get('countryValue') as string;

  const data = await prisma.home.update({
    where: {
      id: homeId,
    },
    data: {
      addedLocation: true,
      country: countryValue,
    },
  });

  return redirect('/');
};

export const addToFavorite = async (formData: FormData) => {
  const userId = formData.get('userId') as string;
  const homeId = formData.get('homeId') as string;

  const pathname = formData.get('pathname') as string;

  const data = await prisma.favorite.create({
    data: {
      homeId: homeId,
      userId: userId,
    },
  });

  revalidatePath(pathname);
};

export const deleteFromFavorite = async (formData: FormData) => {
  const favoriteId = formData.get('favoriteId') as string;
  const userId = formData.get('userId') as string;

  const pathname = formData.get('pathname') as string;

  const data = await prisma.favorite.delete({
    where: {
      id: favoriteId,
      userId: userId,
    },
  });

  revalidatePath(pathname);
};

export async function createReservation(formData: FormData) {
  const userId = formData.get('userId') as string;
  const homeId = formData.get('homeId') as string;

  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;

  const data = await prisma.reservation.create({
    data: {
      userId: userId,
      endDate: endDate,
      startDate: startDate,
      homeId: homeId,
    },
  });

  return redirect('/');
}

// when using server actions, you always have to mark the file using 'use server'
