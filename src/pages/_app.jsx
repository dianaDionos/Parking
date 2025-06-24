import '../styles/globals.css';
import Sidebar from '../components/Sidebar';

export default function MyApp({ Component, pageProps }) {
  return (
    <Sidebar>
      <Component {...pageProps} />
    </Sidebar>
  );
}