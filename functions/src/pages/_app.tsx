import { createGlobalStyle, ThemeProvider } from 'styled-components'
import theme from '../themes/style'
import Head from 'next/head'

const GlobalStyle = createGlobalStyle`
body {
    font-family: "Varela Round", Arial, sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
}
a {
  text-decoration: none;
}

* {
  box-sizing: border-box;
  outline: 10px solid red;
}

.slick-prev,
.slick-next {
  position: absolute !important;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.slick-next {
  left: auto;
  right: 0;
}

.slick-prev {
  left: 0;
  right: auto;
  
}

.slick-track {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
}

/***** Fix for Algolia search Icon *******/
.ap-icon-pin {
  display: none;
}

/* Screen-reader text only - Taken from bootstrap 4 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
`

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Varela+Round&display=optional"
          rel="stylesheet"
        />
      </Head>
      <GlobalStyle />
      <div>App shell</div>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
