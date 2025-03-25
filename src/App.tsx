import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './global.css';

/* Pages */
import Home from './pages/Home';
import Auth from './pages/Auth';
import MealDetails from './pages/MealDetails';

setupIonicReact({
  mode: 'md'
});

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    // Force light mode
    document.body.classList.remove('dark');
    // Add light mode class
    document.body.classList.add('light');
    // Set color scheme meta tag
    const meta = document.createElement('meta');
    meta.name = 'color-scheme';
    meta.content = 'light';
    document.head.appendChild(meta);
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/auth">
            <Auth />
          </Route>
          <Route exact path="/home">
            {isAuthenticated ? <Home /> : <Redirect to="/auth" />}
          </Route>
          <Route exact path="/">
            <Redirect to="/auth" />
          </Route>
          <Route path="/meal/:id">
            {isAuthenticated ? <MealDetails /> : <Redirect to="/auth" />}
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
