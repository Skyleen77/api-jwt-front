'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  return (
    <form
      className="flex flex-col max-w-2xl py-20 mx-auto gap-y-5"
      action={async (formData: FormData) => {
        console.log('formData', formData);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
          const res = await axios.post(
            'http://localhost:3400/user/login',
            {
              email,
              password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          console.log('res', res);
          Cookies.set('token', res.data.token, { secure: true });

          router.push('/');
        } catch (error) {
          console.log('error', error);
        }
      }}
    >
      <h1 className="text-3xl font-bold text-center">Login</h1>
      <Input placeholder="Email" name="email" />
      <Input placeholder="Password" name="password" type="password" />
      <Button>Login</Button>
    </form>
  );
};

export default LoginPage;
