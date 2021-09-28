import { useState, useEffect } from "react";
import { IonInput, IonSelect, IonIcon, IonLabel, IonButton, useIonViewWillEnter, IonItem, IonPage, IonSelectOption } from '@ionic/react';
import './Home.scss';
import home from '../../assets/images/home.png';
import type2 from '../../assets/images/type2.png';

import * as ls from "local-storage";

const Home = () => {

    const Data = {
        "angle_left": 0,
        "Weight_left": 0,
        "Radius_left": 0,

        "angle_right": 0,
        "Weight_right": 0,
        "Radius_right": 0,
    };

    useIonViewWillEnter(() => {
        let stored = ls.get('calibration');
        if (stored == null) {
            ls.set("calibration", Data);
            ls.set("useCalib", false);
            ls.set("AVG", 5);
            ls.set("unit", "um");
            ls.set("Divider", 2);
            ls.set("multiplierA", 1);
            ls.set("multiplierB", 1);
            ls.set("CorrMagP1", []);
            ls.set("CorrAngP1", []);
      
            ls.set("CorrMagP2", []);
            ls.set("CorrAngP2", []);
            ls.set("pdfDataP1", [{}]);
            ls.set("pdfDataP2", [{}]);
        }
    });

    const [A, setA] = useState();
    const [B, setB] = useState();
    const [C, setC] = useState();

    const [Config, setConfig] = useState(1);

    const [image, setimage] = useState(home);
    const [RPM, setRPM] = useState(0);
    const [Weight, setWeight] = useState(0);
    const [Grade, setGrade] = useState(6.3);
    const [UperL, setUperL] = useState(0);
    const [UperR, setUperR] = useState(0);

    const [Total, setTotal] = useState(0);

    const [Radius1, setRadius1] = useState(0);
    const [Radius2, setRadius2] = useState(0);

    const Save = () => {
        var CG = B / 2
        var Uper = ((9549 * Grade * Weight) / RPM);
        var Uper = (Uper / 2).toFixed(1);

        var uperL = ((Uper / Radius1).toFixed(2));
        var uperR = ((Uper / Radius2).toFixed(2));
        var total = parseFloat(uperR) + parseFloat(uperR)

        setUperL(uperL);
        setUperR(uperR);
        setTotal(total);
    }

    const Close = () => {

    }

    useEffect(() => {
        if (Config == 1) setimage(home);
        if (Config == 2) setimage(type2);
    }, [Config])

    return (
        <IonPage>
            <div className="Home">
                <div className="top">
                    <IonItem lines="none">
                        <h2 slot="start">Configuration</h2>
                        <IonItem className="boxSelect" lines="none" >
                            <IonSelect
                                interface="popover"
                                onIonChange={e => setConfig(e.detail.value)}
                                value={Config}>
                                <IonSelectOption value={1}>Standard Type </IonSelectOption>
                                <IonSelectOption value={2}>Type 2 </IonSelectOption>
                                <IonSelectOption value={3}>Type 3 </IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonItem>
                </div>

                <div className="assembly">

                    <div className="center">
                        <img src={image} alt="Girl in a jacket" width="500" height="600"></img>
                        <div className="calc">
                            <div className="ass">
                                <div className="calcLeft">
                                    <IonItem lines="none">
                                        <h2 slot="start">ISO G </h2>
                                        <IonItem className="boxSelect" lines="none" >
                                            <IonSelect
                                                interface="popover"
                                                onIonChange={e => setGrade(e.detail.value)}
                                                value={Grade}>
                                                <IonSelectOption value={0.16}>G 0.16 </IonSelectOption>
                                                <IonSelectOption value={0.4}>G 0.4 </IonSelectOption>
                                                <IonSelectOption value={1}>G 1 </IonSelectOption>
                                                <IonSelectOption value={2.5}>G 2.5 </IonSelectOption>
                                                <IonSelectOption value={6.3}>G 6.3 </IonSelectOption>
                                                <IonSelectOption value={16}>G 16 </IonSelectOption>
                                                <IonSelectOption value={40}>G 40 </IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                        <h3 >G</h3>
                                    </IonItem>

                                    <IonItem lines="none">
                                        <h2 slot="start">RPM</h2>
                                        <div className="boxSelect">
                                            <IonInput type="number" value={RPM} onIonChange={e => setRPM(parseInt(e.detail.value))}></IonInput>
                                        </div>
                                        <h3 >rpm</h3>
                                    </IonItem>

                                    <IonItem lines="none">
                                        <h2 slot="start">Weight</h2>
                                        <div className="boxSelect">
                                            <IonInput type="number" value={Weight} onIonChange={e => setWeight(parseFloat(e.detail.value))}></IonInput>
                                        </div>
                                        <h3 >Kg</h3>
                                    </IonItem>

                                    <IonItem lines="none">
                                        <h2 slot="start">Radius 1</h2>
                                        <div className="boxSelect">
                                            <IonInput type="number" value={Radius1} onIonChange={e => setRadius1(parseInt(e.detail.value))}></IonInput>
                                        </div>
                                        <h3 >mm</h3>
                                    </IonItem>
                                </div>

                                <div className="calcLeft">
                                    <IonItem lines="none">
                                        <h2 slot="start">A Value</h2>
                                        <div className="boxSelect">
                                            <IonInput type="number" value={A} onIonChange={e => setA(parseInt(e.detail.value))}></IonInput>
                                        </div>
                                        <h3 >mm</h3>
                                    </IonItem>

                                    <IonItem lines="none">
                                        <h2 slot="start">B Value</h2>
                                        <div className="boxSelect">
                                            <IonInput type="number" value={B} onIonChange={e => setB(parseInt(e.detail.value))}></IonInput>
                                        </div>
                                        <h3 >mm</h3>
                                    </IonItem>

                                    <IonItem lines="none">
                                        <h2 slot="start">C Value</h2>
                                        <div className="boxSelect">
                                            <IonInput type="number" value={C} onIonChange={e => setC(parseInt(e.detail.value))}></IonInput>
                                        </div>
                                        <h3 >mm</h3>
                                    </IonItem>

                                    <IonItem lines="none">
                                        <h2 slot="start">Radius 2</h2>
                                        <div className="boxSelect">
                                            <IonInput type="number" value={Radius2} onIonChange={e => setRadius2(parseInt(e.detail.value))}></IonInput>
                                        </div>
                                        <h3 >mm</h3>
                                    </IonItem>

                                </div>
                            </div>


                            <div className="resultCalc">
                                <h3 >Acceptable residual unbalance</h3>
                                <IonItem lines="none">
                                    <h2 slot="start">Uper-L</h2>
                                    <div className="boxSelect">
                                        <IonInput type="number" value={UperL}></IonInput>
                                    </div>
                                    <h3 >g</h3>
                                </IonItem>

                                <IonItem lines="none">
                                    <h2 slot="start">Uper-R</h2>
                                    <div className="boxSelect">
                                        <IonInput type="number" value={UperR}></IonInput>
                                    </div>
                                    <h3 >g</h3>
                                </IonItem>

                                <IonItem lines="none">
                                    <h2 slot="start">Total-U</h2>
                                    <div className="boxSelect">
                                        <IonInput type="number" value={Total}></IonInput>
                                    </div>
                                    <h3 >g</h3>
                                </IonItem>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="buttonSave">
                    <IonButton color="medium" onClick={Save}>Save </IonButton>
                    <IonButton color="medium" onClick={Close}>Cancel</IonButton>
                </div>

            </div>

        </IonPage>
    )
}

export default Home
