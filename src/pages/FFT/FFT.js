import {useIonViewWillEnter} from '@ionic/react';
import { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");

const FFT = () => {

    useIonViewWillEnter(() => {
        ipcRenderer.send('byte', "F\n");
        ipcRenderer.send('byte', "S\n");
      });

    return (
        <div>
            
        </div>
    )
}

export default FFT
