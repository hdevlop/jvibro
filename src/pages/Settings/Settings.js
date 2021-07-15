import { IonContent, IonCard, IonPage, IonSegment, IonSelect, IonButton, IonSelectOption, IonSegmentButton, IonLabel, IonItem } from '@ionic/react';
import React, { useState, useEffect } from "react";
import './settings.scss';

import Calibration from './Calibration';
import Parameters from './Parameters';

const Settings = () => {
    const [state, setstate] = useState("Parameters");

    return (
        <IonPage>
            <IonContent className="settings">
                <IonCard>
                    <IonSegment value={state} onIonChange={e => setstate(e.detail.value)}>
                        <IonSegmentButton value="Parameters">
                            <IonLabel>Parameters</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="Calibration">
                            <IonLabel>Calibration</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="Options">
                            <IonLabel>Options</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="Functions">
                            <IonLabel>ABC Functions</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    
                        {(() => {
                            if (state === "Parameters") return (<Parameters/>)
                            if (state === "Calibration") return (<Calibration />)
                            // if (Tab === "Options") return (<TabSerial />)
                            // if (Tab === "Functions") return (<TabSerial />)
                        })()}
                    
            
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Settings;