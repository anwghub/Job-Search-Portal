import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className='py-10 bg-[#D7DEDC] text-gray-800 flex justify-between items-center'>
        <Link href="/">
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
            <h1 className='font-extrabold text-2xl text-[#7263f3]'>Job Portal</h1>
        </Link>

        <ul className='flex items-center gap-8'></ul>
    </header>
  )
}

export default Header