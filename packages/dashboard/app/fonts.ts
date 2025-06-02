import localFont from 'next/font/local';

export const aeonik = localFont({
  src: [
    {
      path: '../public/fonts/AeonikTRIAL-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/AeonikTRIAL-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/AeonikTRIAL-Light.otf',
      weight: '300',
      style: 'normal',
    },
  ],
  variable: '--font-aeonik',
});
