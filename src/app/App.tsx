import { RouterProvider } from 'react-router';
import { router } from './routes';
import { TowelProvider } from './context/TowelContext';

export default function App() {
  return (
    <TowelProvider>
      <RouterProvider router={router} />
    </TowelProvider>
  );
}