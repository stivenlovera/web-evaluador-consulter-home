import './App.css';
import { storeToken } from './Reducers';
import RouteApp from './Routers/RouteApp';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <Provider store={storeToken}>
      <SnackbarProvider maxSnack={3}>
        <RouteApp />
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
