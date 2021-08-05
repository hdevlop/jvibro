import { useState, useEffect } from "react";
import { IonInput, IonSelect, IonIcon, IonLabel, IonButton, useIonViewWillEnter, IonItem, IonPage, IonSelectOption } from '@ionic/react';
import './Home.scss';
import home from '../../assets/images/home.png';
import type2 from '../../assets/images/type2.png';

import * as ls from "local-storage";

const Home = () => {

    const Data = {
        "angle_left": 1,
        "Weight_left": 0,
        "Radius_left": 0,

        "angle_right": 0,
        "Weight_right": 0,
        "Radius_right": 0,
    };

    useIonViewWillEnter(() => {
        let stored = ls.get('calibration');
        if (stored == null) ls.set("calibration", Data);
    });

    const [A, setA] = useState();
    const [B, setB] = useState();
    const [C, setC] = useState();

    const [Config, setConfig] = useState(1);

    const [image, setimage] = useState(home);


    const Save = () => {

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
                    <div className="right">

                    </div>

                    <div className="center">
                        <img src={image} alt="Girl in a jacket" width="500" height="600"></img>
                        <div className="calc">
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
                            </div>

                            <div className="calcRight">
                                <IonItem lines="none">
                                    <h2 slot="start">Radius 1</h2>
                                    <div className="boxSelect">
                                        <IonInput type="number" value={A} onIonChange={e => setA(parseInt(e.detail.value))}></IonInput>
                                    </div>
                                    <h3 >mm</h3>
                                </IonItem>

                                <IonItem lines="none">
                                    <h2 slot="start">Radius 2</h2>
                                    <div className="boxSelect">
                                        <IonInput type="number" value={B} onIonChange={e => setB(parseInt(e.detail.value))}></IonInput>
                                    </div>
                                    <h3 >mm</h3>
                                </IonItem>

                                <IonItem lines="none">
                                    <h2 slot="start">RPM Bal</h2>
                                    <div className="boxSelect">
                                        <IonInput type="number" value={C} onIonChange={e => setC(parseInt(e.detail.value))}></IonInput>
                                    </div>
                                    <h3 >rpm</h3>
                                </IonItem>
                            </div>

                        </div>
                    </div>

                    <div className="left">

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
