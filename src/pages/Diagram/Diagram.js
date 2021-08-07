import { useState } from 'react'
import { IonSelectOption, IonSelect, IonIcon, IonLabel, IonRadio, IonModal, IonCard, IonRadioGroup, IonItem, IonButton, IonPage, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import polar4 from '../../assets/images/polarCW.png';
import { pulse, sync } from 'ionicons/icons';
import './FinalBalancing.scss';
import P5Wrapper from 'react-p5-wrapper';
import { P5Plane1, sketch } from './p5Plane1';
import * as ls from "local-storage";

const { remote, ipcRenderer } = window.require("electron");
const delay = require('delay');

var count = 0;
const Diagram = () => {

    ipcRenderer.on('freq', (event, arg) => {
        setRPM(parseInt(arg * 60));
    });

    let currentWindow = remote.getCurrentWindow()
    const [range, setRange] = useState("10M");
    const [RPM, setRPM] = useState(0);

    
    var [Start, setStart] = useState(Start);
    var [CountStep, setCountStep] = useState(0);
    var [State, setState] = useState("");
    var [count1, setCount1] = useState(0);
    
    var Msg1 = "Step1: Install standard part, Measure without adding calibration weight";
    var Msg2 = `Step2: In Plan1 Add Trial weight of ${ls.get('calibration').Weight_left} gr Run At ${ls.get('calibration').angle_left} Deg `;
    var Msg2 = `Step3: In Plan2 Add Trial weight of ${ls.get('calibration').Weight_right} gr Run At ${ls.get('calibration').angle_right} Deg `;

    var [showModal, setShowModal] = useState(false);
    var [ModalAverage, setModalAverage] = useState(false);
    var [ModalCalib, setModalCalib] = useState(false);

    var [MsgModal, setMsgModal] = useState(Msg1);

    var [add, setadd] = useState(ls.get('add'));
    var [init, setInit] = useState(ls.get('init'));
    var [average,setAverage] = useState(ls.get('AVG'));
    var [selected, setSelected] = useState(ls.get('plane'));
    var [useCalib, setUseCalib] = useState(ls.get('useCalib'));
    
    var [Leds, setLeds] = useState({});
    
    useIonViewWillEnter(() => {
        setCountStep(init);
        if (selected == "P2") {
            ipcRenderer.send('byte', "B");
        }
        else {
            ipcRenderer.send('byte', "b");
        }

        setAverage(ls.get('AVG'));
        setUseCalib(ls.get('useCalib'))
    });

    //=======================================================================//
    //============================ Blancing Step ============================//
    const EStart = () => {
        ipcRenderer.send('byte', "S");
        ipcRenderer.send('byte', "S");
        ipcRenderer.removeAllListeners('bal');
        setStart(true);
        if (CountStep == 0) {
            StateGest("b", "FirstRun_b1", "Led1_b1");
        }
        if (CountStep == 1) {
            StateGest("B", "FirstRun_b2", "Led1_b2");
        }
        if (CountStep == 2) {
            StateGest("b", "TrialRun_b1", "Led2_b1");
        }
        if (CountStep == 3) {
            StateGest("B", "TrialRun_b2", "Led2_b2");
        }
        if (CountStep == 4) {
            StateGest("b", "LastRun_b1", "Led3_b1");
        }
        if (CountStep == 5) {
            StateGest("B", "LastRun_b2", "Led3_b2");
        }
        if (CountStep > 5) currentWindow.reload()

        ipcRenderer.on('bal', (event, arg) => {
            setModalAverage(true);
            setCount1(count1 += 1);
            if (count1 > average) {
                setModalAverage(false);
                setCount1(0);
                setStart(false);
                ipcRenderer.send('byte', "S");
                ipcRenderer.send('byte', "S");
                ipcRenderer.removeAllListeners('bal');
                setCountStep(CountStep += add);
            }
        })
    }

    const StateGest = async (bytes, state, leds) => {
        setModalCalib(useCalib);
        await ipcRenderer.send('byte', bytes);

        if (useCalib){
            await ipcRenderer.send('byte', 'c');
            await delay(2000);
            await ipcRenderer.send('byte', "s");
        }


        if (useCalib){
            ipcRenderer.on('calib', async (event, arg) => {
                ipcRenderer.removeAllListeners('calib');
                ipcRenderer.send('byte', "S");
                ipcRenderer.send('byte', "S");
                await delay(100);
                await ipcRenderer.send('byte', "d");
                await delay(3000);
                await ipcRenderer.send('byte', "s");
                setLeds({ ...Leds, [leds]: true });
                setState(state);
                setModalCalib(false)
            }) 
        } 

        else {
            await ipcRenderer.send('byte', "d");
            await delay(100);
            await ipcRenderer.send('byte', "s");
            setLeds({ ...Leds, [leds]: true });
            setState(state);
        }
    }

    useIonViewDidLeave(() => {
        setCountStep(0);
        ipcRenderer.send('byte', "S");
        setStart(false);
    });

    const SelectPlane = (e) => {
        setSelected(e);
        ls.set('plane', e);
        if (e == 'dual') {
            ls.set('add', 1);
            ls.set('init', 0);
            setadd(1);
            setInit(0);
        }
        if (e == 'P1') {
            setadd(2);
            setInit(0);
            ls.set('add', 2);
            ls.set('init', 0);
        }
        if (e == 'P2') {
            setadd(2);
            setInit(1);
            ls.set('add', 2);
            ls.set('init', 1);
        }
        currentWindow.reload()
    }

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
                                <div className={`led led-${Leds.Led1_b1 ? "active" : "release"}`}></div>
                            </div>

                            <div className="content">
                                <IonLabel color="success">S2</IonLabel>
                                <div className={`led led-${Leds.Led2_b1 ? "active" : "release"}`}></div>
                            </div>

                            <div className="content">
                                <IonLabel color="success">S3</IonLabel>
                                <div className={`led led-${Leds.Led3_b1 ? "active" : "release"}`}></div>
                            </div>
                        </div>


                        <div id="polarGraph" className="polarGraph">
                            <P5Wrapper style={{ position: 'absolute' }} sketch={P5Plane1} range={range} State={State} Start={Start} />
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
                                <IonSelectOption value="5M">5M</IonSelectOption>
                                <IonSelectOption value="10M">10M</IonSelectOption>
                                <IonSelectOption value="15M">15M</IonSelectOption>
                                <IonSelectOption value="20M">20M</IonSelectOption>
                                <IonSelectOption value="50M">50M</IonSelectOption>
                                <IonSelectOption value="100M">100M</IonSelectOption>
                                <IonSelectOption value="200M">200M</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem lines='none' color="transparent">
                            <IonButton className={`${Start ? "active" : "release"}`} expand="round" fill="outline" onClick={EStart} >Start</IonButton>
                        </IonItem>
                        <div className={`led led-${Start ? "active" : "release"}`}></div>

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
                                <div className={`led led-${Leds.Led1_b2 ? "active" : "release"}`}></div>
                            </div>

                            <div className="content">
                                <IonLabel color="success">S2</IonLabel>
                                <div className={`led led-${Leds.Led2_b2 ? "active" : "release"}`}></div>
                            </div>

                            <div className="content">
                                <IonLabel color="success">S3</IonLabel>
                                <div className={`led led-${Leds.Led3_b2 ? "active" : "release"}`}></div>
                            </div>
                        </div>
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
                                <IonLabel color="red"></IonLabel><br />
                            </IonItem>

                            <IonItem lines='none' color="transparent">
                                <IonIcon icon={sync}></IonIcon>
                                <IonLabel color="danger">Angle</IonLabel><br />
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