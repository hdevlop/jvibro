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
    const [Divider, setDivider] = useState(ls.get("Divider"));

    const Save =  () => {
        ls.set("AVG", AVG);
        ls.set("useCalib", Calibration);
        ls.set("unit", unit);
        ls.set("Divider", Divider);
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
                    <div className="boxSelect">
                        <IonInput type="number" value={AVG} onIonChange={e => setAVG(parseInt(e.detail.value))}></IonInput>
                    </div>
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


                <IonItem lines="none">
                    <h2 slot="start">Divider</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={Divider} onIonChange={e => setDivider(parseFloat(e.detail.value))}></IonInput>
                    </div>
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