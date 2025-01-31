import type { Metadata } from "next";
import { Poppins } from 'next/font/google'

import "./globals.css";
// import { getCurrentUser } from "@/lib/actions/user.actions";
// import { redirect } from 'next/navigation';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt - The only storage solution you need.",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    // const currentUser = await getCurrentUser();
  
    // if (!currentUser) return redirect('/sign-in');

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        {children}
      </body>
    </html>
  );
}