import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactHashRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from 'ionicons/icons';

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
import "./assets/scss/tab.scss";

import { pulse, sync } from "ionicons/icons";
import coor from "./assets/images/coor.svg";
import sound from "./assets/images/sound.svg";
import radar from "./assets/images/radar.svg";
import Settings from "./assets/images/settings.svg";
import printer from "./assets/images/printer.svg";
import landingPage from "./assets/images/landing-page.svg";
import oscilloscope from "./assets/images/oscilloscope.svg";

import Diagram from './pages/Diagram/Diagram';
import VibroMeter from './pages/Vibrometer/VibroMeter';
import Setting from './pages/Settings/Settings';

import Printer from './pages/Printer/Printer';

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4000";
const socket = socketIOClient(ENDPOINT);

const App = () => {

  const handleTabWillChange = (e) => {
    socket.emit('state', e.detail.tab)
    console.log(e.detail.tab);
  }
  return (
    <IonApp>
      <IonReactHashRouter>
        <IonTabs onIonTabsWillChange={handleTabWillChange}>
          <IonRouterOutlet>
            <Route path="/diagram" component={Diagram} exact={true} />
            <Route path="/vibroMeter" component={VibroMeter} exact={true} />
            <Route path="/rotorSetup" component={VibroMeter} exact={true} />
            <Route path="/settings" component={Setting} exact={true} />
            <Route path="/printer" component={Printer} exact={true} />
            <Route exact path="/" render={() => <Redirect to="/diagram" />} />
          </IonRouterOutlet>

          <IonTabBar slot="top">
            <IonTabButton tab="Home" href="/Home">
              <img src={landingPage} alt="" />
              <span>Home</span>
            </IonTabButton>
            <IonTabButton tab="Diagram" href="/diagram">
              <img src={radar} alt="" />
              <span>Diagram</span>
            </IonTabButton>
            <IonTabButton tab="VibroMeter" href="/vibroMeter">
              <img src={sound} alt="" />
              <span>VibroMeter</span>
            </IonTabButton>
            <IonTabButton tab="RealTime" href="/realTime">
              <img src={oscilloscope} alt="" />
              <span>Real Time</span>
            </IonTabButton>
            <IonTabButton tab="Settings" href="/settings">
              <img src={Settings} alt="" />
              <span>Settings</span>
            </IonTabButton>
            <IonTabButton tab="Printer" href="/printer">
              <img src={printer} alt="" />
              <span>Printer</span>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactHashRouter>
    </IonApp>
  )
}

export default App;
