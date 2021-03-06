import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonViewWillEnter
} from '@ionic/react';
import { IonReactHashRouter } from "@ionic/react-router";

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

import sound from "./assets/images/sound.svg";
import radar from "./assets/images/radar.svg";
import Settings from "./assets/images/settings.svg";
import printer from "./assets/images/printer.svg";
import landingPage from "./assets/images/landing-page.svg";
import oscilloscope from "./assets/images/oscilloscope.svg";

import Diagram from './pages/Diagram/Diagram';
import VibroMeter from './pages/Vibrometer/VibroMeter';
import Setting from './pages/Settings/Settings';
import Home from './pages/Home/Home.js';
import FFT from './pages/FFT/FFT.js';

import * as ls from "local-storage";
import Printer from './pages/Printer/Printer';
import './app.scss';
import "@progress/kendo-theme-default/dist/all.css";
const { ipcRenderer } = window.require("electron");


const App = () => {


  const Data = {
    "angle_left": 1,
    "Weight_left": 0,
    "Radius_left": 0,

    "angle_right": 0,
    "Weight_right": 0,
    "Radius_right": 0,
  };

  useIonViewWillEnter(() => {
    let stored = ls.get('calibration');
    if (stored == null) {
      ls.set("calibration", Data);
      ls.set("useCalib", false);
      ls.set("AVG", 5);
      ls.set("unit", "um");
      ls.set("Divider", 2);
      ls.set("multiplierA", 1);
      ls.set("multiplierB", 1);

      ls.set("CorrMagP1", []);
      ls.set("CorrAngP1", []);

      ls.set("CorrMagP2", []);
      ls.set("CorrAngP2", []);
    }
  });

  const handleTabWillChange = (e) => {
    ipcRenderer.send('Tabs', e.detail.tab)
  }
  return (
    <IonApp>
      <IonReactHashRouter>
        <IonTabs onIonTabsWillChange={handleTabWillChange}>
          <IonRouterOutlet>
            <Route path="/Home" component={Home} exact={true} />
            <Route path="/diagram" component={Diagram} exact={true} />
            <Route path="/vibroMeter" component={VibroMeter} exact={true} />
            <Route path="/FFT" component={FFT} exact={true} />
            <Route path="/settings" component={Setting} exact={true} />
            <Route path="/printer" component={Printer} exact={true} />
            <Route exact path="/" render={() => <Redirect to="/Home" />} />
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
              <img src={oscilloscope} alt="" />
              <span>VibroMeter</span>
            </IonTabButton>
            <IonTabButton tab="RealTime" href="/FFT">
              <img src={sound} alt="" />
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
