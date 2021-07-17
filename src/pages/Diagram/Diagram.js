import React, { useState, useEffect } from 'react'
import { IonSelectOption, IonSelect, IonIcon, IonLabel, IonModal, IonCard, IonItem, IonButton, IonPage, useIonViewDidLeave, useIonViewWillEnter} from '@ionic/react';
import polar4 from '../../assets/images/polarCW.png';
import { pulse, sync } from 'ionicons/icons';
import './FinalBalancing.scss';
import P5Wrapper from 'react-p5-wrapper';
import { P5Plane1, sketch } from './p5Plane1';
import * as ls from "local-storage";

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4000";
const socket = socketIOClient(ENDPOINT);


// const { ipcRenderer } = window.require("electron");

const Diagram = () => {
    const [range, setRange] = useState("2g");
    const [RPM, setRPM] = useState(0);
    const [Amp, setAmp] = useState(0);
    const [Angle, setAngle] = useState(0);

    var [Start, setStart] = useState(false);
    var [Stop, setStop] = useState(true);
    var [CountStep, setCountStep] = useState(0);
    var [State, setState] = useState("");

    var Msg1 = "Install standard part, Measure without adding calibration weight";
    var Msg2 = `Add Trial of ${ls.get('calibration').Weight_left} gr Run At ${ls.get('calibration').angle_left} Deg `;

    var [showModal, setShowModal] = useState(true);
    var [MsgModal, setMsgModal] = useState(Msg1);


    useIonViewWillEnter(() => {
        setShowModal(true);
        setCountStep(0)
        socket.emit("arduino", "stop");
        setStop(true);
    });

    socket.on('freq', (freq) => {
        setRPM(freq * 60)
    });

    // ipcRenderer.on('serial', (event, freq, results) => {
    //     var Amp = parseFloat(results[0] / 0.1).toFixed(3);
    //     var Angle = parseInt(results[1]);
    //     setRPM(freq);
    //     setAmp(Amp);
    //     setAngle(Angle);
    // })


    //=======================================================================//
    //============================ Blancing Step ============================//
    const EStart = () => {
        socket.emit("arduino", "start");
        setStart(true);
        
        if (Stop) {
            
            setStop(false);
            setCountStep(CountStep + 1)
            if (CountStep == 0) setState("FirstRun");
            if (CountStep == 1) setState("TrialRun"); 
            if (CountStep == 2) setState("LastRun");
        }
    }

    const EStop = () => {
        socket.emit("arduino", "stop");
        setStop(true);
        if (State == "FirstRun") {setMsgModal(Msg2); setShowModal(true)}
    }

    
    useIonViewDidLeave(() => {
        setCountStep(0)
        socket.emit("arduino", "stop");
        setStop(true);
    });
    //======================================================================//
    //======================================================================//

    return (
        <IonPage>
            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} cssClass='ModalBalancing'>
                <div className="modal">
                    <p>{MsgModal}</p>
                </div>
            </IonModal>

            <div className="Plotter">

                <div className="sensorProjection">
                    {/* ================================================================== */}
                    <div className="sensorA">
                        <P5Wrapper style={{ position: 'absolute' }} sketch={P5Plane1} State={State} Start={Start} Stop={Stop}/>

                        <div id="polarGraph" className="polarGraph">
                            <img src={polar4} alt="" />
                        </div>
                    </div>
                    {/* ================================================================== */}

                    <div className="no">
                        <IonItem lines='none' color="transparent">
                            <IonLabel color="success">Range</IonLabel>
                        </IonItem>
                        <IonItem lines='none' color="transparent">
                            <IonSelect value={range} placeholder="Select One" onIonChange={e => setRange(e.detail.value)}>
                                <IonSelectOption value="1g">1g</IonSelectOption>
                                <IonSelectOption value="2g">2g</IonSelectOption>
                                <IonSelectOption value="4g">4g</IonSelectOption>
                                <IonSelectOption value="8g">8g</IonSelectOption>
                                <IonSelectOption value="10g">10g</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem lines='none' color="transparent">
                            <IonButton color="warning" expand="round" fill="outline" onClick={EStart} >Start</IonButton>
                        </IonItem>
                        <IonItem lines='none' color="transparent">
                            <IonButton color="danger" expand="round" fill="outline" onClick={EStop}>Stop</IonButton>
                        </IonItem>


                    </div>

                    {/* ================================================================== */}
                    <div className="sensorB">
                        <div id="polarGraph" className="polarGraph">
                            <img src={polar4} alt="" />
                        </div>
                    </div>
                    {/* ================================================================== */}
                </div>
                <div className="result">
                    <div className="resultL">
                        <P5Wrapper style={{ position: 'absolute' }} sketch={sketch} />
                        <IonCard>
                            <IonItem lines='none' color="transparent">
                                <IonIcon icon={pulse}></IonIcon>
                                <IonLabel color="danger">Amp</IonLabel><br />
                                <IonLabel color="red"> </IonLabel><br />
                            </IonItem>

                            <IonItem lines='none' color="transparent">
                                <IonIcon icon={sync}></IonIcon>
                                <IonLabel color="danger">Angle</IonLabel><br />
                                <IonLabel color="red"> </IonLabel><br />
                            </IonItem>
                        </IonCard>

                    </div>
                    <div className="Rpm">
                        <IonItem lines='none' color="transparent">
                            <IonLabel color="success">Speed</IonLabel><br />
                        </IonItem>
                        <IonItem lines='none' color="transparent">
                            <IonLabel color="success">{RPM}</IonLabel><br />
                        </IonItem>
                    </div>
                    <div className="resultR">
                        <IonCard>
                            <IonItem lines='none' color="transparent">
                                <IonIcon icon={pulse}></IonIcon>
                                <IonLabel color="danger">Amp</IonLabel><br />
                                <IonLabel color="red">2.10 g</IonLabel><br />
                            </IonItem>

                            <IonItem lines='none' color="transparent">
                                <IonIcon icon={sync}></IonIcon>
                                <IonLabel color="danger">Angle</IonLabel><br />
                                <IonLabel color="red">160 °</IonLabel><br />
                            </IonItem>
                        </IonCard>
                    </div>
                </div>
            </div>

        </IonPage >
    );
};

export default Diagram;
