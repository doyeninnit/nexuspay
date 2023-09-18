// import { Html, Head, Main, NextScript } from 'next/document'

// export default function Document() {
//   return (
//     <Html lang="en">
//     <link rel="manifest" href="/manifest.json" />
//     <link rel="apple-touch-icon" href="/icon-512x512.png"></link>
//     <meta name="theme-color" content="#000" />
//       <Head />
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-512x512.png"></link>
        {/* <meta name="theme-color" content="#000" /> */}
        <meta  name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}