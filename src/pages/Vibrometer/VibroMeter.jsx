import { IonContent, useIonViewWillEnter, IonButton, IonPage, IonLabel, IonItem, IonSelect, IonSelectOption, IonToggle, IonRange } from '@ionic/react';
import oscilloBack from './oscilloBack';
import cap1 from './cap1';
import cap2 from './cap2';
import cap3 from './capT';
import './VibroMeter.scss';
import P5Wrapper from 'react-p5-wrapper';
import { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");
const delay = require('delay');

const VibroMeter = () => {
  let [rangeCH1, setRangeCH1] = useState("w");
  let [rangeCH2, setRangeCH2] = useState("W");
  let [rangeCH3, setRangeCH3] = useState("W");

  let [PosCh1, setPosCh1] = useState();
  let [PosCh2, setPosCh2] = useState();
  let [PosCh3, setPosCh3] = useState();

  let [Time, setTime] = useState(1024);

  let [State, setState] = useState("stop");

  const [checkCap1, setCheckCap1] = useState(false);
  const [checkCap2, setCheckCap2] = useState(false);
  const [checkCap3, setCheckCap3] = useState(false);

  const updateRangeChanged = (e) => {
    setRangeCH1( e.target.value );
    ipcRenderer.send('byte', e.target.value);
  };

  const updatePosistionChanged = (e) => {
    setPosCh1(e.target.value );
  };

  const updateRangeChanged2 = (e) => {
    setRangeCH2(e.target.value);
    ipcRenderer.send('byte', e.target.value);
  };

  const updatePosistionChanged2 = (e) => {
    setPosCh2(e.target.value);
  };

  const updateRangeChanged3 = (e) => {
    setRangeCH3(e.target.value);
    ipcRenderer.send('byte', e.target.value);
  };

  const updatePosistionChanged3 = (e) => {
    setPosCh3(e.target.value);
  };

  const updateTime = (e) => {
    setTime(e.target.value);
  };

  const STATE = async(e) => {
    let state = e.target.innerText;
    setState(state);
    ipcRenderer.send('byte', e.target.getAttribute('value'));
    ipcRenderer.send('byte', e.target.getAttribute('value'));
  }

  useIonViewWillEnter(() => {
    ipcRenderer.send('byte', "o\n");
    ipcRenderer.send('byte', "S\n");
  });

  useEffect(() => {
    
    async function selectChannel() {

    }

    selectChannel();

  }, [checkCap1, checkCap2, checkCap3])

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="backgroundRealTime">
          <div className="oscillo">
            <P5Wrapper style={{ position: 'absolute' }} sketch={oscilloBack} />
            <P5Wrapper style={{ position: 'absolute' }} sketch={cap1} rangeCH1={rangeCH1} PosCh1={PosCh1}  state={State} time={Time} />
            <P5Wrapper style={{ position: 'absolute' }} sketch={cap2} rangeCH2={rangeCH2} PosCh2={PosCh2} state={State} time={Time} />
            <P5Wrapper style={{ position: 'absolute' }} sketch={cap3} rangeCH3={rangeCH3} PosCh3={PosCh3} state={State} time={Time} />
          </div>

          <IonRange snaps={true} pin={true} color="warning" value={Time} name="posTime" min={10} max={2048} step={1} onIonChange={updateTime} />


          <div className="content"></div>
          <div className="settings">

            <div className="ch">
              <IonItem lines="none" color="transparent">
                <IonLabel color="warning">CH 1</IonLabel>
                <IonToggle checked={checkCap1} color="warning" onIonChange={e => setCheckCap1(e.detail.checked)}/>
              </IonItem>

              <IonItem lines="none" color="transparent">
                <IonSelect
                  interface="popover"
                  className="button select"
                  value={rangeCH1}
                  name="rangeCH1"
                  placeholder="+5v"
                  onIonChange={updateRangeChanged}
                >
                  <IonSelectOption value="x">+ 10v</IonSelectOption>
                  <IonSelectOption value="w">+ 5v</IonSelectOption>
                  <IonSelectOption value="y">+ 1v</IonSelectOption>
                  <IonSelectOption value="z">+ 0.5v</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem lines="none" color="transparent">
                <IonRange
                  color="warning"
                  value={PosCh1}
                  name="posCH1"
                  min={-5.0}
                  max={5.0}
                  step={0.5}
                  onIonChange={updatePosistionChanged}
                />
              </IonItem>
            </div>

            <div className="ch">
              <IonItem lines="none" color="transparent">
                <IonLabel color="danger">CH 2</IonLabel>
                <IonToggle checked={checkCap2}  color="danger" onIonChange={e => setCheckCap2(e.detail.checked)}/>
              </IonItem>

              <IonItem lines="none" color="transparent">
                <IonSelect
                  interface="popover"
                  className="button select"
                  value={rangeCH2}
                  name="rangeCH2"
                  placeholder="+5v"
                  onIonChange={updateRangeChanged2}
                >
                  <IonSelectOption value="X">+ 10v</IonSelectOption>
                  <IonSelectOption value="W">+ 5v</IonSelectOption>
                  <IonSelectOption value="Z">+ 1v</IonSelectOption>
                  <IonSelectOption value="Y">+ 0.5v</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem lines="none" color="transparent">
                <IonRange
                  color="danger"
                  value={PosCh2}
                  name="posCH2"
                  min={-5.0}
                  max={5.0}
                  step={1}
                  onIonChange={updatePosistionChanged2}
                />
              </IonItem>
            </div>

            <div className="ch">
              <IonItem lines="none" color="transparent">
                <IonLabel color="success">CH 3</IonLabel>
                <IonToggle checked={checkCap3}  color="success" onIonChange={e => setCheckCap3(e.detail.checked)} />
              </IonItem>

              <IonItem lines="none" color="transparent">
                <IonSelect
                  interface="popover"
                  className="button select"
                  value={rangeCH3}
                  name="rangeCH3"
                  placeholder="+5v"
                  onIonChange={updateRangeChanged3}
                >
                  <IonSelectOption value="X">+ 10v</IonSelectOption>
                  <IonSelectOption value="W">+ 5v</IonSelectOption>
                  <IonSelectOption value="Z">+ 1v</IonSelectOption>
                  <IonSelectOption value="Y">+ 0.5v</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem lines="none" color="transparent">
                <IonRange
                  color="success"
                  value={PosCh3}
                  name=" "
                  min={-5.0}
                  max={5.0}
                  step={1}
                  onIonChange={updatePosistionChanged3}
                />
              </IonItem>
            </div>
            <IonButton color="success" value="s" onClick={e => STATE(e)}>start</IonButton>
            <IonButton color="warning" value="p" onClick={e => STATE(e)}>pause</IonButton>
            <IonButton color="danger " value="S" onClick={e => STATE(e)}>stop</IonButton>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default VibroMeter;
