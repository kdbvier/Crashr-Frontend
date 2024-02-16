import SpecNFT from '@/components/sections/SpecNFT'
import React from 'react'
import { Metadata } from "next";
import Head from 'next/head';
type Props = {
  params: { id: string };
};

// export const generateMetadata = ({ params }: Props): Metadata => {
//   return {
//     title: `Product`,
//   };
// };

// export const metadata: Metadata = {
//   title: 'Title',
//   description: '...',
// }

const Page = () => {
  return (
    <>

      <SpecNFT />
    </>
  )
}

export default Page