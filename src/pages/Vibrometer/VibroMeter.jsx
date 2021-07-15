import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton,IonPage, IonLabel, IonItem, IonSelect, IonSelectOption, IonToggle, IonRange } from '@ionic/react';
import oscilloBack from './oscilloBack';
import cap1 from './cap1';
import cap2 from './cap2';
import './VibroMeter.scss';
import P5Wrapper from 'react-p5-wrapper';
import React, { useState, useEffect } from "react";

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4000";
const socket = socketIOClient(ENDPOINT);

const Home = () => {
  let [arrRange, setarrRange] = useState([]);
  let [arrRange2, setarrRange2] = useState([]);

  let [arrPos, setArrPos] = useState([]);
  let [arrPos2, setArrPos2] = useState([]);

  let [State, setState] = useState("STOP");

  const updateRangeChanged = (e) => {
    setarrRange({ ...arrRange, [e.target.name]: e.target.value });
  };

  const updatePosistionChanged = (e) => {
    setArrPos({ ...arrPos, [e.target.name]: e.target.value });
  };

  const updateRangeChanged2 = (e) => {
    setarrRange2({ ...arrRange2, [e.target.name]: e.target.value });
  };

  const updatePosistionChanged2 = (e) => {
    setArrPos2({ ...arrPos2, [e.target.name]: e.target.value });
  };

  const START = () => {
    setState("START");
    socket.emit('state', "START");
  }

  const PAUSE = () => {
    setState("PAUSE");
    socket.emit('state', "PAUSE");
  }

  const STOP = () => {
    setState("STOP");
    socket.emit('state', "STOP");
  }

  const STATE = (e) => {
    let state = e.target.innerText;
    setState(state);
    socket.emit('state', state);
  }

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="backgroundRealTime">
          <div className="oscillo">
            <P5Wrapper style={{ position: 'absolute' }} sketch={oscilloBack} />
            <P5Wrapper style={{ position: 'absolute' }} sketch={cap1} ArrRange={arrRange}  ArrPos={arrPos} state={State}/>
            <P5Wrapper style={{ position: 'absolute' }} sketch={cap2} ArrRange={arrRange2} ArrPos={arrPos2} state={State}/>
          </div>


          <div className="content"></div>
          <div className="settings">

            <div className="ch">
              <IonItem lines="none" color="transparent">
                <IonLabel color="warning">CH 1</IonLabel>
                <IonToggle color="warning" />
              </IonItem>

              <IonItem lines="none" color="transparent">
                <IonSelect
                  interface="popover"
                  className="button select"
                  value={arrRange.rangeCH1}
                  name="rangeCH1"
                  placeholder="+5v"
                  onIonChange={updateRangeChanged}
                >
                  <IonSelectOption value="5">+ 5v</IonSelectOption>
                  <IonSelectOption value="2">+ 2v</IonSelectOption>
                  <IonSelectOption value="1">+ 1v</IonSelectOption>
                  <IonSelectOption value="0.5">+ 0.5v</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem lines="none" color="transparent">
                <IonRange
                  color="warning"
                  value={arrPos.posCH1}
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
                <IonToggle color="danger" />
              </IonItem>

              <IonItem lines="none" color="transparent">
                <IonSelect
                  interface="popover"
                  className="button select"
                  value={arrRange2.rangeCH2}
                  name="rangeCH2"
                  placeholder="+5v"
                  onIonChange={updateRangeChanged2}
                >
                  <IonSelectOption value="5">+ 5v</IonSelectOption>
                  <IonSelectOption value="2">+ 2v</IonSelectOption>
                  <IonSelectOption value="1">+ 1v</IonSelectOption>
                  <IonSelectOption value="0.5">+ 0.5v</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem lines="none" color="transparent">
                <IonRange
                  color="danger"
                  value={arrPos2.posCH2}
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
                <IonToggle color="success" />
              </IonItem>

              <IonItem lines="none" color="transparent">
                <IonSelect
                  interface="popover"
                  className="button select"
                  value={arrRange.rangeCH3}
                  name="rangeCH3"
                  placeholder="+5v"
                  onIonChange={updateRangeChanged}
                >
                  <IonSelectOption value="5">+ 5v</IonSelectOption>
                  <IonSelectOption value="2">+ 2v</IonSelectOption>
                  <IonSelectOption value="1">+ 1v</IonSelectOption>
                  <IonSelectOption value="0.5">+ 0.5v</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem lines="none" color="transparent">
                <IonRange
                  color="success"
                  value={arrPos.posCH3}
                  name=" "
                  min={-5.0}
                  max={5.0}
                  step={1}
                  onIonChange={updatePosistionChanged}
                />
              </IonItem>
            </div>
            <IonButton color="success" value="START" onClick={e => STATE(e)}>Start</IonButton>
            <IonButton color="warning" value="PAUSE" onClick={e => STATE(e)}>PAUSE</IonButton>
            <IonButton color="danger " value="STOP"  onClick={e => STATE(e)}>Stop</IonButton>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Home;