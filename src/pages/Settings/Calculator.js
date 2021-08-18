import { IonContent, IonCard, IonPage, IonSegment, IonSelect, IonButton, IonSelectOption, IonInput, IonItem } from '@ionic/react';
import React, { useState, useEffect } from "react";
import './Calculator.scss';
import reg from '../../assets/images/reg.png';
import Swal from 'sweetalert2'
import * as ls from "local-storage";

import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

const Calculator = () => {

    const [RPM, setRPM] = useState(0);
    const [Weight, setWeight] = useState(0);
    const [Grade, setGrade] = useState(6.3);
    const [Uper, setUper] = useState(6.3);
    const [Eper, setEper] = useState(6.3);

    const [Radius, setRadius] = useState(0);
    const [TW, setTW] = useState(0);

    const Save = () => {

        var Uper = ((9549 * Grade * Weight) / RPM).toFixed(1);

        setUper(Uper);
        setEper((Uper / Weight).toFixed(1))
        setTW((Uper / Radius).toFixed(1));
    }

    const Close = () => {

    }

    return (
        <div className="settingsP">
            <div className="content">
                <img src={reg} alt="Girl in a jacket" width="500" height="600"></img>

                <h1>ISO Calculator</h1>

                <IonItem lines="none">
                    <h2 slot="start">RPM</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={RPM} onIonChange={e => setRPM(parseInt(e.detail.value))}></IonInput>
                    </div>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">Radius </h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={Radius} onIonChange={e => setRadius(parseInt(e.detail.value))}></IonInput>
                    </div>
                    <h3 >mm</h3>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">Weight</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={Weight} onIonChange={e => setWeight(parseFloat(e.detail.value))}></IonInput>
                    </div>
                    <h3 >Kg</h3>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">ISO Grade </h2>
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

                <div className="separate"></div>
                <IonItem lines="none">
                    <h2 slot="start">Residuel Unbalance</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={Uper}></IonInput>
                    </div>
                    <h3 >g-mm  (+15%)</h3>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">Residuel Eccentricity </h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={Eper}></IonInput>
                    </div>
                    <h3 >um</h3>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">Trial Weight</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={TW}></IonInput>
                    </div>
                    <h3 >g  * (5-TW-10)</h3>
                </IonItem>

            </div>

            <div className="buttonSave">
                <IonButton color="medium" onClick={Save}>Calculate </IonButton>
                <IonButton color="medium" onClick={Close}>Cancel</IonButton>
            </div>
        </div>

    );
};

export default Calculator;