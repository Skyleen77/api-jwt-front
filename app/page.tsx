'use client';

import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const res = await axios.get('http://localhost:3400/users', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Cookies.get('token'),
          },
        });

        return res.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            Cookies.remove('token');
            router.push('/login');
          }
          console.log('error', error);
        }
      }
    },
  });

  console.log('users', users);

  const queryClient = useQueryClient();

  return (
    <main>
      <h1>Shop Online</h1>
      <p>Welcome to the online shop</p>

      <Button
        onClick={async () => {
          await axios.post(
            'http://localhost:3400/user',
            {
              user_name: 'John Doe',
              user_email: `john.doe-${Math.floor(
                Math.random() * 10000,
              )}@exemple.com`,
              user_phone: '1234567890',
              user_fname: 'John',
              user_lname: 'Doe',
              user_password: 'password',
              user_city: 2,
              user_adress: '1 rue de Paris',
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: Cookies.get('token'),
              },
            },
          );
          await queryClient.invalidateQueries({
            queryKey: ['users'],
          });
        }}
      >
        Add user
      </Button>

      <div className="grid grid-cols-5 gap-5 mt-10">
        {users &&
          users?.length &&
          users?.map((user: any) => (
            <div className="p-5 border rounded-xl">
              <p>{user.user_name}</p>
              <p>{user.user_email}</p>
              <p>{user.user_phone}</p>
              <p>{user.user_fname}</p>
              <p>{user.user_lname}</p>
              <p>{user.user_city}</p>
              <p>{user.user_adress}</p>
            </div>
          ))}
      </div>
    </main>
  );
}
