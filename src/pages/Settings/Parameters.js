import { IonContent, IonCard, IonPage, IonSegment, IonSelect, IonButton, IonSelectOption, IonSegmentButton, IonLabel, IonItem } from '@ionic/react';
import React, { useState, useEffect } from "react";
import './Parameters.scss';
import reg from '../../assets/images/reg.png';
const { ipcRenderer } = window.require("electron");
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:4000";
// const socket = socketIOClient(ENDPOINT);


const Parameters = () => {

    const [Baud, setBaud] = useState(115200);
    const [COM, setCOM] = useState("COM2");
    const [Freq, setFreq] = useState(512);
    const [Samples, setSamples] = useState(512);
    const [Channel, setChannel] = useState(1);

    const Save = () => {
        const Data = { Baudrate: Baud, PortCOM: COM, Freqency: Freq, Samples: Samples };
        // socket.emit('SendToARD', Data);
        ipcRenderer.send('SendToARDConfig', Data)
    }

    return (
        <div className="settingsP">
            <div className="content">
                <img src={reg} alt="Girl in a jacket" width="500" height="600"></img>

                <h1>Data Acquisition</h1>

                <IonItem lines="none">
                    <h2 slot="start">Port COM</h2>
                    <IonItem className="boxSelect" lines="none"  >
                        <IonSelect
                            interface="popover"
                            onIonChange={e => setCOM(e.detail.value)}
                            value={COM}>
                            <IonSelectOption value={"COM2"}>COM2</IonSelectOption>
                            <IonSelectOption value={"COM3"}>COM3</IonSelectOption>
                            <IonSelectOption value={"COM4"}>COM4</IonSelectOption>
                            <IonSelectOption value={"COM5"}>COM5</IonSelectOption>
                            <IonSelectOption value={"COM6"}>COM6</IonSelectOption>
                            <IonSelectOption value={"COM7"}>COM7</IonSelectOption>
                            <IonSelectOption value={"COM8"}>COM8</IonSelectOption>
                            <IonSelectOption value={"COM9"}>COM9</IonSelectOption>
                            <IonSelectOption value={"COM10"}>COM10</IonSelectOption>
                            <IonSelectOption value={"COM11"}>COM11</IonSelectOption>
                            <IonSelectOption value={"COM12"}>COM12</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">Baudrate</h2>
                    <IonItem className="boxSelect" lines="none" >
                        <IonSelect
                            interface="popover"
                            onIonChange={e => setBaud(e.detail.value)}
                            value={Baud}>
                            <IonSelectOption value={9600}>9600 </IonSelectOption>
                            <IonSelectOption value={19200}>19200 </IonSelectOption>
                            <IonSelectOption value={38400}>38400 </IonSelectOption>
                            <IonSelectOption value={57600}>57600 </IonSelectOption>
                            <IonSelectOption value={115200}>115200 </IonSelectOption>
                            <IonSelectOption value={200000}>200000 </IonSelectOption>
                            <IonSelectOption value={250000}>250000 </IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">Sampling Freq</h2>
                    <IonItem className="boxSelect" lines="none" >
                        <IonSelect
                            interface="popover"
                            onIonChange={e => setFreq(e.detail.value)}
                            value={Freq}>
                            <IonSelectOption value={256}>256 </IonSelectOption>
                            <IonSelectOption value={512}>512 </IonSelectOption>
                            <IonSelectOption value={1024}>1024 </IonSelectOption>
                            <IonSelectOption value={2048}>2048 </IonSelectOption>
                            <IonSelectOption value={4096}>4096 </IonSelectOption>
                            <IonSelectOption value={8192}>8192 </IonSelectOption>
                            <IonSelectOption value={16384}>16384 </IonSelectOption>
                            <IonSelectOption value={32768}>32768 </IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">Samples</h2>
                    <IonItem className="boxSelect" lines="none" >
                        <IonSelect
                            interface="popover"
                            onIonChange={e => setSamples(e.detail.value)}
                            value={Samples}>
                            <IonSelectOption value={256}>256 </IonSelectOption>
                            <IonSelectOption value={512}>512 </IonSelectOption>
                            <IonSelectOption value={1024}>1024 </IonSelectOption>
                            <IonSelectOption value={2048}>2048 </IonSelectOption>
                            <IonSelectOption value={4096}>4096 </IonSelectOption>
                            <IonSelectOption value={8192}>8192 </IonSelectOption>
                            <IonSelectOption value={16384}>16384 </IonSelectOption>
                            <IonSelectOption value={32768}>32768 </IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">Channel</h2>
                    <IonItem className="boxSelect" lines="none" >
                        <IonSelect
                            interface="popover"
                            onIonChange={e => setChannel(e.detail.value)}
                            value={Channel}>
                            <IonSelectOption value={1}>1 </IonSelectOption>
                            <IonSelectOption value={2}>2 </IonSelectOption>
                            <IonSelectOption value={3}>3 </IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonItem>
            </div>
            <div className="buttonSave">
                <IonButton color="medium" onClick={Save}>Save </IonButton>
                <IonButton color="medium" >Cancel</IonButton>
            </div>
        </div>

    );
};

export default Parameters;