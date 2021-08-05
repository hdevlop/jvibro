import React, { useState, useEffect } from 'react'
import { IonLabel, IonItem, IonButton, IonPage, IonInput, IonToggle } from '@ionic/react';
import './printer.scss';
const { ipcRenderer } = window.require("electron");

const Printer = () => {

    const [Angle, setAngle] = useState(135);
    const [Mag, setMag] = useState(5.6);
    const [Freq, setFreq] = useState(10);
    const [checked, setChecked] = useState(false);
    var bal = "bal1";
    const Send = () => {
        if (checked) bal = "bal2";
        else bal = "bal1";
        ipcRenderer.send("balancing", `${bal},${Mag},${Angle}\n`);
    }
    const SendFreq = () => {
        ipcRenderer.send("balancing", `freq,${Freq}\n`);
    }

    return (
        <IonPage>
            <div className="printer">
                <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} />
                <IonItem lines='none' color="transparent">
                    <IonLabel color="success" style={{ fontSize: "60px" }}>Angle</IonLabel>
                    <IonInput type="number" style={{ fontSize: "60px" }} value={Angle} placeholder="Enter Number" onIonChange={e => setAngle(e.detail.value, 10)}></IonInput>
                </IonItem>

                <IonItem lines='none' color="transparent">
                    <IonLabel color="success" style={{ fontSize: "60px" }}>Mag</IonLabel>
                    <IonInput type="number" style={{ fontSize: "60px" }} value={Mag} placeholder="Enter Number" onIonChange={e => setMag(e.detail.value, 10)}></IonInput>
                </IonItem>

                <IonItem lines='none' color="transparent">
                    <IonButton color="warning" expand="round" fill="outline" onClick={Send}>Send</IonButton>
                </IonItem>
            </div>

            <div className="printer freq">
                <IonItem lines='none' color="transparent">
                    <IonLabel color="success" style={{ fontSize: "60px" }}>freq</IonLabel>
                    <IonInput type="number" style={{ fontSize: "60px" }} value={Freq} placeholder="Enter Number" onIonChange={e => setFreq(e.detail.value, 10)}></IonInput>
                </IonItem>

                <IonItem lines='none' color="transparent">
                    <IonButton color="warning" expand="round" fill="outline" onClick={SendFreq}>Send</IonButton>
                </IonItem>
            </div>
        </IonPage>
    )
}

export default Printer
