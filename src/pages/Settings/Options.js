import { IonContent, IonCard, IonPage, IonSegment, IonSelect, IonButton, IonSelectOption, IonInput, IonItem } from '@ionic/react';
import React, { useState, useEffect } from "react";
import './Options.scss';
import reg from '../../assets/images/reg.png';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as ls from "local-storage";
const MySwal = withReactContent(Swal)
const { ipcRenderer } = window.require("electron");
const delay = require('delay');


const Parameters = () => {

    const [AVG, setAVG] = useState(ls.get("AVG"));
    const [Calibration, setCalibration] = useState(ls.get("useCalib"));
    const [unit, setUnit] = useState(ls.get("unit"));

    const Save =  () => {
        ls.set("AVG", AVG);
        ls.set("useCalib", Calibration);
        ls.set("unit", unit);
    }

    const Close = () => {

    }

    return (
        <div className="settingsP">
            <div className="content">
                <img src={reg} alt="Girl in a jacket" width="500" height="600"></img>

                <h1>Acquisition Options</h1>

                <IonItem lines="none">
                    <h2 slot="start">Average</h2>
                    <IonItem className="boxSelect" lines="none" >
                        <IonSelect
                            interface="popover"
                            onIonChange={e => setAVG(e.detail.value)}
                            value={AVG}>
                            <IonSelectOption value={1}>1 </IonSelectOption>
                            <IonSelectOption value={2}>2 </IonSelectOption>
                            <IonSelectOption value={3}>3 </IonSelectOption>
                            <IonSelectOption value={4}>4 </IonSelectOption>
                            <IonSelectOption value={5}>5 </IonSelectOption>
                            <IonSelectOption value={6}>6 </IonSelectOption>
                            <IonSelectOption value={7}>7 </IonSelectOption>
                            <IonSelectOption value={8}>8 </IonSelectOption>
                            <IonSelectOption value={9}>9 </IonSelectOption>
                            <IonSelectOption value={10}>10 </IonSelectOption>
                            <IonSelectOption value={11}>11 </IonSelectOption>
                            <IonSelectOption value={12}>12 </IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">Calibration</h2>
                    <IonItem className="boxSelect" lines="none" >
                        <IonSelect
                            interface="popover"
                            onIonChange={e => setCalibration(e.detail.value)}
                            value={Calibration}>
                            <IonSelectOption value={true}>true </IonSelectOption>
                            <IonSelectOption value={false}>false </IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">Metric </h2>
                    <IonItem className="boxSelect" lines="none" >
                        <IonSelect
                            interface="popover"
                            onIonChange={e => setUnit(e.detail.value)}
                            value={unit}>
                            <IonSelectOption value={"mV"}>mV </IonSelectOption>
                            <IonSelectOption value={"mils"}>mils </IonSelectOption>
                            <IonSelectOption value={"um"}>um </IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonItem>

            </div>
            <div className="buttonSave">
                <IonButton color="medium" onClick={Save}>Send </IonButton>
                <IonButton color="medium" onClick={Close}>Cancel</IonButton>
            </div>
        </div>

    );
};

export default Parameters;