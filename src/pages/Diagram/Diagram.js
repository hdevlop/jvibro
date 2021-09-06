import { useState } from 'react'
import { IonSelectOption, IonSelect, IonIcon, IonLabel, IonRadio, IonModal, IonCard, IonRadioGroup, IonItem, IonButton, IonPage, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import polar4 from '../../assets/images/polarCW.png';
import { pulse, sync } from 'ionicons/icons';
import './FinalBalancing.scss';
import P5Wrapper from 'react-p5-wrapper';
import { P5Plane1, sketch } from './p5Plane1';
import { P5Plane2, sketch2 } from './p5Plane2';
import * as ls from "local-storage";

const { remote, ipcRenderer } = window.require("electron");
const delay = require('delay');

const Diagram = () => {

    const options = {
        cssClass: 'hicham'
    };
    let currentWindow = remote.getCurrentWindow()
    const [rangeA, setRangeA] = useState(ls.get("multiplierA"));
    const [rangeB, setRangeB] = useState(ls.get("multiplierB"));
    const [RPM, setRPM] = useState(0);
    var [Start, setStart] = useState(Start);
    var [Next, setNext] = useState(false);
    var [CountStep, setCountStep] = useState(0);
    var [StateA, setStateA] = useState("");
    var [StateB, setStateB] = useState("");
    var [count1, setCount1] = useState(0);
    var Msg1 = "Step1: Install standard part, Measure without adding calibration weight";
    var Msg2 = `Step2: In Plan1 Add Trial weight of ${ls.get('calibration').Weight_left} gr Run At ${ls.get('calibration').angle_left} Deg `;
    var Msg3 = `Step3: In Plan2 Add Trial weight of ${ls.get('calibration').Weight_right} gr Run At ${ls.get('calibration').angle_right} Deg `;
    var [showModal, setShowModal] = useState(false);
    var [ModalAverage, setModalAverage] = useState(false);
    var [ModalCalib, setModalCalib] = useState(false);
    var [MsgModal, setMsgModal] = useState(Msg1);
    var [average, setAverage] = useState(ls.get('AVG'));
    var [selected, setSelected] = useState(ls.get('plane'));
    var [useCalib, setUseCalib] = useState(ls.get('useCalib'));
    var [Led1_b1, setLed1_b1] = useState(false);
    var [Led1_b2, setLed1_b2] = useState(false);
    var [Led2_b1, setLed2_b1] = useState(false);
    var [Led2_b2, setLed2_b2] = useState(false);


    useIonViewWillEnter(() => {
        setAverage(ls.get('AVG'));
        setUseCalib(ls.get('useCalib'));
        setRangeA(ls.get("multiplierA"));
        setRangeB(ls.get("multiplierB"));

        if (CountStep == 0) {
            setMsgModal(Msg1);
            setShowModal(true)
        }

            ipcRenderer.on('Freq', (event, arg) => {
        setRPM(parseInt(arg * 60));
    });
    });

    //=======================================================================//
    //============================ Blancing Step ============================//
    const EStart = async() => {
        setNext(false)
        ipcRenderer.send('byte', "S");
        ipcRenderer.send('byte', "S");
        ipcRenderer.removeAllListeners('Bal');
        setStart(true);
        setModalCalib(useCalib);
        sendBytesStart();

        if (CountStep == 0) {
            setStateA("FirstRun_b1");
            setStateB("FirstRun_b2");
            setLed1_b1(true);
            setLed1_b2(true);
        }

        ipcRenderer.on('Bal', (event, arg) => {
            setModalCalib(false)
            setModalAverage(true);
            setCount1(count1 += 1);
            if (count1 > average) {
                setModalAverage(false);
                setCount1(0);
                setStart(false);
                ipcRenderer.send('byte', "S");
                ipcRenderer.send('byte', "S");
                ipcRenderer.removeAllListeners('Bal');
            }
        })
    }
    //=============================== Next State ===============================//
    //==========================================================================//
    const ENext = async () => {
        setNext(true);
        setCountStep(CountStep += 1);
        setCount1(0);
        if (CountStep == 0) {
            setStateA("FirstRun_b1");
            setStateB("FirstRun_b2");
            setLed1_b1(true);
            setLed1_b2(true);
        }

        if (CountStep == 1) {
            setStateA("TrialRun_b1");
            setStateB("TrialRun_b2");
            setLed2_b1(true);
            setLed2_b2(true);

            setMsgModal(Msg2);
            setShowModal(true);
        }
        if (CountStep > 1) currentWindow.reload();
    }
    //=============================== send Byte ================================//
    //==========================================================================//
    const sendBytesStart = async() => {
        await ipcRenderer.send('byte', "g");
        await delay(100);
        await ipcRenderer.send('byte', "s");
    }


    //=============================== Next State ===============================//
    //==========================================================================//
    useIonViewDidLeave(() => {
        ipcRenderer.send('byte', "S");
        setStart(false);
    });

    const SelectPlane = (e) => {
        setSelected(e);
        ls.set('plane', e);
        if (e == 'dual') {

        }
        if (e == 'P1') {

        }
        if (e == 'P2') {

        }
        currentWindow.reload()
    }

    const updateRangeChanged = (e) => {
        setRangeA(e.target.value);
        ipcRenderer.send('byte', e.target.value);
        ls.set("multiplierA", e.target.value);
    };

    const updateRangeChanged2 = (e) => {
        setRangeB(e.target.value);
        ipcRenderer.send('byte', e.target.value);
        ls.set("multiplierB", e.target.value);
    };

    //======================================================================//
    //======================================================================//

    return (
        <IonPage>
            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} cssClass='ModalBalancing'>
                <div className="modal">
                    <p>{MsgModal}</p>
                </div>
            </IonModal>

            <IonModal isOpen={ModalAverage} onDidDismiss={() => setModalAverage(false)} cssClass='ModalAverage'>
                <div className="modal">
                    <p>Averaging Data </p>
                    <h1>{count1}</h1>
                </div>
            </IonModal>

            <IonModal isOpen={ModalCalib} onDidDismiss={() => setModalCalib(false)} cssClass='ModalCalib'>
                <div className="modal">
                    <p>Calibrating Sensor</p>
                </div>
            </IonModal>


            <div className="Plotter">

                <div className="sensorProjection">
                    {/* ================================================================== */}
                    <div className="sensorA">
                        <div className="leds">

                            <div className="content">
                                <IonLabel color="success">S1</IonLabel>
                                <div className={`led led-${Led1_b1 ? "active" : "release"}`}></div>
                            </div>
 
                            <div className="content">
                                <IonLabel color="success">S2</IonLabel>
                                <div className={`led led-${Led2_b1 ? "active" : "release"}`}></div>
                            </div>
                        </div>


                        <div id="polarGraph" className="polarGraph">
                            <P5Wrapper style={{ position: 'absolute' }} sketch={P5Plane1} range={rangeA} State={StateA} Start={Start} set0={Next} />
                            <img src={polar4} alt="" />
                        </div>
                    </div>
                    {/* ================================================================== */}

                    <div className="no">
                        <IonItem lines='none' color="transparent">
                            <IonLabel color="success">Range A</IonLabel>
                        </IonItem>
                        <IonItem lines='none' color="transparent">
                            <IonSelect interface="popover" interfaceOptions={options} value={rangeA} placeholder="Select One" onIonChange={updateRangeChanged}>
                                <IonSelectOption value={'a'}>8000um</IonSelectOption>
                                <IonSelectOption value={'b'}>2000um</IonSelectOption>
                                <IonSelectOption value={'c'}>250um</IonSelectOption>
                                <IonSelectOption value={'d'}>25um</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem lines='none' color="transparent">
                            <IonLabel color="success">Range B</IonLabel>
                        </IonItem>
                        <IonItem lines='none' color="transparent">
                            <IonSelect interface="popover" interfaceOptions={options} value={rangeB} placeholder="Select One" onIonChange={updateRangeChanged2}>
                                <IonSelectOption value={'A'}>8000um</IonSelectOption>
                                <IonSelectOption value={'B'}>2000um</IonSelectOption>
                                <IonSelectOption value={'C'}>250um</IonSelectOption>
                                <IonSelectOption value={'D'}>25um</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonItem lines='none' color="transparent">
                            <IonButton className={"Start"} expand="round" fill="outline" onClick={EStart} >Start</IonButton>
                        </IonItem>

                        <IonItem lines='none' color="transparent">
                            <IonButton className={"Next"} expand="round" fill="outline" onClick={ENext} >Next</IonButton>
                        </IonItem>

                        {/* <div className={`led led-${Start ? "active" : "release"}`}></div> */}

                        <IonRadioGroup value={selected} onIonChange={e => SelectPlane(e.detail.value)}>

                            <IonItem>
                                <h2>Dual</h2>
                                <IonRadio slot="start" value="dual" />
                            </IonItem>

                            <IonItem>
                                <h2>P1</h2>
                                <IonRadio slot="start" value="P1" />
                            </IonItem>

                            <IonItem>
                                <h2>P2</h2>
                                <IonRadio slot="start" value="P2" />
                            </IonItem>

                        </IonRadioGroup>
                        {/* <IonItem lines='none' color="transparent">
                            <IonButton color="danger" expand="round" fill="outline" onClick={EStop}>Stop</IonButton>
                        </IonItem> */}
                    </div>

                    {/* ================================================================== */}
                    <div className="sensorB">
                        <div className="leds">
                            <div className="content">
                                <IonLabel color="success">S1</IonLabel>
                                <div className={`led led-${Led1_b2 ? "active" : "release"}`}></div>
                            </div>

                            <div className="content">
                                <IonLabel color="success">S2</IonLabel>
                                <div className={`led led-${Led2_b2 ? "active" : "release"}`}></div>
                            </div>

                        </div>
                        <div id="polarGraphB" className="polarGraphB">
                            <P5Wrapper style={{ position: 'absolute' }} sketch={P5Plane2} range={rangeB} State={StateB} Start={Start} set1={Next} />
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
                                <IonLabel color="danger">Mag</IonLabel><br />
                                <IonLabel color="red"> </IonLabel><br />
                            </IonItem>

                            <IonItem lines='none' color="transparent">
                                <IonIcon icon={sync}></IonIcon>
                                <IonLabel color="danger">Phase</IonLabel><br />
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
                        <P5Wrapper style={{ position: 'absolute' }} sketch={sketch2} />
                        <IonCard>
                            <IonItem lines='none' color="transparent">
                                <IonIcon icon={pulse}></IonIcon>
                                <IonLabel color="danger">Mag</IonLabel><br />
                                <IonLabel color="red"></IonLabel><br />
                            </IonItem>

                            <IonItem lines='none' color="transparent">
                                <IonIcon icon={sync}></IonIcon>
                                <IonLabel color="danger">Phase</IonLabel><br />
                                <IonLabel color="red"></IonLabel><br />
                            </IonItem>
                        </IonCard>
                    </div>
                </div>
            </div>

        </IonPage >
    );
};

export default Diagram;


// const EStop = () => {
//     ipcRenderer.removeAllListeners('bal1');
//     ipcRenderer.send('ST_SP', "stop");
//     setStop(true);
//     if (State == "FirstRun") {setMsgModal(Msg2); setShowModal(true)}
// }


{/* <IonButton className={`${Start ? "active" : "release"}`} expand="round" fill="outline" onClick={EStart} >Start</IonButton> */ }



// const EStart = () => {
//     ipcRenderer.send('byte', "S");
//     ipcRenderer.send('byte', "S");
//     ipcRenderer.removeAllListeners('bal');
//     setStart(true);
//     if (CountStep == 0) {
//         StateGest("b", "FirstRun_b1", "Led1_b1");
//     }
//     if (CountStep == 1) {
//         StateGest("B", "FirstRun_b2", "Led1_b2");
//     }
//     if (CountStep == 2) {
//         StateGest("b", "TrialRun_b1", "Led2_b1");
//     }
//     if (CountStep == 3) {
//         StateGest("B", "TrialRun_b2", "Led2_b2");
//     }
//     if (CountStep == 4) {
//         StateGest("b", "LastRun_b1", "Led3_b1");
//     }
//     if (CountStep == 5) {
//         StateGest("B", "LastRun_b2", "Led3_b2");
//     }
//     if (CountStep > 5) currentWindow.reload()

//     ipcRenderer.on('bal', (event, arg) => {
//         setModalAverage(true);
//         setCount1(count1 += 1);
//         if (count1 > average) {
//             setModalAverage(false);
//             setCount1(0);
//             setStart(false);
//             ipcRenderer.send('byte', "S");
//             ipcRenderer.send('byte', "S");
//             ipcRenderer.removeAllListeners('bal');
//             setCountStep(CountStep += add);
//         }
//     })
// }