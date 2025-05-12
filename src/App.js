// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import SocketIo from './components/setup/SocketIo';
import  Router from  './routes';
// ----------------------------------------------------------------------

export default function App() {

  return (
    <div>
      <SocketIo />
      <ThemeConfig>
      <GlobalStyles />
      <Router />
    </ThemeConfig>
    </div>
  );
}
