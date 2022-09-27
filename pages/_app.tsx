import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';
import { StateContext } from '../context/StateContext';
import '../styles/globals.css'

const queryClient = new QueryClient()

const theme = {
  colors: {
    primary: '#fff'
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <StateContext>
          <Component {...pageProps} />
        </StateContext>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default MyApp
