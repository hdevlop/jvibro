import React, { useState, useEffect } from 'react'
import { IonSelectOption, IonSelect, IonIcon, IonLabel, IonCard, IonItem, IonButton, IonPage, IonInput } from '@ionic/react';
const { ipcRenderer } = window.require("electron");
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:4000";
// const socket = socketIOClient(ENDPOINT);

const Printer = () => {

    const [Angle, setAngle] = useState(135);
    const [Mag, setMag] = useState(5.6);

    const Send = () => {
        ipcRenderer.send("balancing1", Mag, Angle);
    }


    return (
        <IonPage>
            <div>
                <IonItem lines='none' color="transparent">
                    <IonLabel color="success" style={{ fontSize: "60px" }}>Angle</IonLabel>
                    <IonInput type="number" style={{ fontSize: "60px" }} value={Angle} placeholder="Enter Number" onIonChange={e => setAngle(e.detail.value, 10)}></IonInput>
                </IonItem>

                <IonItem lines='none' color="transparent">
                    <IonLabel color="success" style={{ fontSize: "60px" }}>Mag</IonLabel>
                    <IonInput type="number" style={{ fontSize: "60px" }} value={Mag} placeholder="Enter Number" onIonChange={e => setMag(e.detail.value, 10)}></IonInput>
                </IonItem>

                <IonItem lines='none' color="transparent">
                    <IonButton style={{ fontSize: "60px" }} color="warning" expand="round" fill="outline" onClick={Send}>Send</IonButton>
                </IonItem>
            </div>
        </IonPage>
    )
}

export default Printer
