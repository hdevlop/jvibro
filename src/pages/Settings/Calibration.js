import { IonContent, IonInput, IonSelect, IonButton, useIonViewWillEnter, IonItem } from '@ionic/react';
import React, { useState, useEffect } from "react";
import './calibration.scss';
import calibration from '../../assets/images/calibration.png';
import * as ls from "local-storage"; 
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

const Calibration = () => {

    const [data, setData] = useState(90);

    useIonViewWillEnter(() => {
        let data = ls.get('calibration');
        setData(data);
    });

    const [calib_Ang_Left, setCalib_Ang_Left] = useState(ls.get('calibration').angle_left);
    const [calib_Ang_Right, setCalib_Ang_Right] = useState(ls.get('calibration').angle_right);

    const [calib_Weight_Left, setCalib_Weight_Left] = useState(ls.get('calibration').Weight_left);
    const [calib_Weight_Right, setCalib_Weight_Right] = useState(ls.get('calibration').Weight_right);

    const [calib_Radius_Left, setCalib_Radius_Left] = useState(ls.get('calibration').Radius_left);
    const [calib_Radius_Right, setCalib_Radius_Right] = useState(ls.get('calibration').Radius_right);


    const Save = () => {
        const Data = { 
            "angle_left" : calib_Ang_Left,
            "Weight_left": calib_Weight_Left,
            "Radius_left": calib_Radius_Left,

            "angle_right": calib_Ang_Right,
            "Weight_right": calib_Weight_Right,
            "Radius_right": calib_Radius_Right,
        };
        ls.set("calibration", Data);
        MySwal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Data Saved successfully',
            showConfirmButton: false,
            timer: 2000
        })
    }

    return (

        <div className="settingsC">
            <div className="content">
                <img src={calibration} alt="Girl in a jacket" width="500" height="600"></img>
                
                <h1>Calibration rotor for balancing machine</h1>
                
                <IonItem lines="none">
                    <h2 slot="start">calibration Angle Left</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={calib_Ang_Left} onIonChange={e => setCalib_Ang_Left(parseFloat(e.detail.value))}></IonInput>
                    </div>
                    <h3 >Deg</h3>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">calibration Weight Left</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={calib_Weight_Left} onIonChange={e => setCalib_Weight_Left(parseFloat(e.detail.value))}></IonInput>
                    </div>
                    <h3 >g</h3>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">calibration Radius Left</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={calib_Radius_Left} onIonChange={e => setCalib_Radius_Left(parseFloat(e.detail.value))}></IonInput>
                    </div>
                    <h3 >g</h3>
                </IonItem>

                {/* //==================================================================================================================// */}
                <div className="separate"></div>
                {/* //==================================================================================================================// */}

                <IonItem lines="none">
                    <h2 slot="start">calibration Angle Right</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={calib_Ang_Right} onIonChange={e => setCalib_Ang_Right(parseFloat(e.detail.value))}></IonInput>
                    </div>
                    <h3 >Deg</h3>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">calibration Weight Right</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={calib_Weight_Right} onIonChange={e => setCalib_Weight_Right(parseFloat(e.detail.value))}></IonInput>
                    </div>
                    <h3 >g</h3>
                </IonItem>

                <IonItem lines="none">
                    <h2 slot="start">calibration Radius Right</h2>
                    <div className="boxSelect">
                        <IonInput type="number" value={calib_Radius_Right} onIonChange={e => setCalib_Radius_Right(parseFloat(e.detail.value))}></IonInput>
                    </div>
                    <h3 >g</h3>
                </IonItem>
            </div>
            <div className="buttonSave">
                <IonButton color="medium" onClick={Save}>Save </IonButton>
                <IonButton color="medium" >Cancel</IonButton>
            </div>
        </div>

    );
};

export default Calibration;