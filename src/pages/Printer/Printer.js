import React, { useState, useEffect } from 'react'
import { IonPage, IonModal, useIonViewDidEnter, IonButton } from '@ionic/react';
import './printer.scss';
import { Editor, EditorTools, EditorUtils } from "@progress/kendo-react-editor";
import { loadMessages, LocalizationProvider } from "@progress/kendo-react-intl";
import { deMessages } from "./deMessages";

import tt from '../../assets/images/tt.png'
import * as ls from "local-storage";
import { setTimeout } from 'timers';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

loadMessages(deMessages, "fr");

const { FindAndReplace, Pdf, Bold, Italic, Underline, AlignLeft, AlignRight, AlignCenter, Indent, Outdent, OrderedList, UnorderedList, Print } = EditorTools;

const CustomPdf = props => (
  <Pdf
    {...props}
    savePdfOptions={{
      fileName: "calibrage",
      paperSize: "A4",
      marign: "3cm",
    }}
  />
);


const Printer = () => {

  var [showModal, setShowModal] = useState();

  const editor = React.createRef();

  var [content, setcontent] = useState();
  var P1data = [
    {
      Deg: 0,
      Mass: 0
    },
    {
      Deg: 0,
      Mass: 0
    },
    {
      Deg: 0,
      Mass: 0
    }
    ,
    {
      Deg: 0,
      Mass: 0
    },
    {
      Deg: 0,
      Mass: 0
    }
  ]

  var P2data = [
    {
      Deg: 0,
      Mass: 0
    },
    {
      Deg: 0,
      Mass: 0
    }, {
      Deg: 0,
      Mass: 0
    },
    {
      Deg: 0,
      Mass: 0
    },
    {
      Deg: 0,
      Mass: 0
    }
  ]

  //==============================================================//

  const HtmlToPdf = (x) => {
    var textMagP1 = "";
    var textAngP1 = "";
    var textMagP2 = "";
    var textAngP2 = "";
    var textMagP1Rest = "";
    var textMagP2Rest = "";
    var P1 = [{}];
    var P2 = [{}];

    if (x) {
      P1 = ls.get("pdfDataP1");
      P2 = ls.get("pdfDataP2");
    }

    else {
      P1 = P1data;
      P2 = P2data;
    }

    let arrayMagP1 = P1.map(a => a.Mass);
    let arrayMagP2 = P2.map(a => a.Mass);

    let arrayAngP1 = P1.map(a => a.Deg);
    let arrayAngP2 = P2.map(a => a.Deg);

    arrayMagP1 = arrayMagP1.filter(val => val !== 0);
    arrayMagP2 = arrayMagP2.filter(val => val !== 0);

    arrayAngP1 = arrayAngP1.filter(val => val !== 0);
    arrayAngP2 = arrayAngP2.filter(val => val !== 0);

    if (arrayMagP1.length) {
      for (let i = 0; i < arrayMagP1.length; i++) {
        if (arrayMagP1[i]) {
          textMagP1 += arrayMagP1[i] + "g" + "<br>";
        }
      }
      for (let i = 0; i < arrayMagP1.length; i++) {
        if (arrayMagP1[i]) {
          textAngP1 += arrayAngP1[i] + "°" + "<br>";
        }
      }
    }

    //==============================================================//
    if (arrayMagP2.length) {
      for (let i = 0; i < arrayMagP2.length; i++) {
        if (arrayMagP2[i]) {
          textMagP2 += arrayMagP2[i] + "g" + "<br>";
        }
      }
      for (let i = 0; i < arrayMagP2.length; i++) {
        if (arrayMagP2[i]) {
          textAngP2 += arrayAngP2[i] + "°" + "<br>";
        }
      }
    }
    content = `
    <img src=${tt} alt="Girl in a jacket" width="720" height="100">
   
    <p style="font-size: 16px" >   Casablanca, le </p>
    <p style="font-size: 16px" >   V/REF : BC N° : Verbal </p>
    <p style="font-size: 16px" >   N/REF : NR :  </p>                                                                                                                                                
    <p style="font-size: 16px">   Objet : Attestation d’équilibrage  </p> 
    <p style="font-size: 16px">   Par la présente, nous, la Société NAREP, attestons que le matériel présenté dans la rubrique désignation 
    a été équilibré comme il est décrit dans les colonnes P1 et P2.
    </p> 
    <TABLE border="1" id='myTable'>
      <tr>
        <th rowspan="2">Désignation</th>
        <th colspan="3"><p style="text-align:center">P1</p></th>
        <th colspan="3"><p style="text-align:center">P2</p></th>
      </tr>

        <tr>
          <th colspan="1"><p style="text-align:center">Degrés</p></th>
          <th colspan="1"><p style="text-align:center">Masse</p></th>
          <th colspan="1"><p style="text-align:center">Reste</p></th>

          <th colspan="1"><p style="text-align:center">Degrés</p></th>
          <th colspan="1"><p style="text-align:center">Masse</p></th>
          <th colspan="1"><p style="text-align:center">Reste</p></th>
        </tr>

        <tr>
            <th colspan="1">
              <p style="margin-bottom: 0;font-weight: bold;text-decoration-line: underline">Equilibrage:</p>
              <p style="margin-top: 0;font-weight: bold;text-decoration-line: none"></p>
            </th>
            <th colspan="1">
                <p style="text-align:center">${textAngP1}</p>
            </th>
            <th colspan="1">
                <p style="text-align:center">${textMagP1}</p>
            </th>
            <th colspan="1">
                <p></p>
            </th>

            <th colspan="1">
                <p style="text-align:center">${textAngP2}</p>
            </th>
            <th colspan="1">
                <p style="text-align:center">${textMagP2}</p>
            </th>
            <th colspan="1">
                <p></p>
            </th>
        </tr>

    </TABLE>

    <p  style="font-size: 16px" >




    <span style="font-weight: bold;text-decoration-line: underline">N.B :</span>  (Pour éviter les contestations)</p> 

    <p  style="font-size: 16px" >    1/ Toute modification apportée par nos soins sur la pièce à équilibrer (masse ajoutée ou partie touchée par 
       enlèvement de matière) est peinte par nos soins avec de la peinture Bleue

    2/ Toute pièce équilibrée par nos soins est marquée du N° du dossier, tel que cité dans la 1ère Colonne de cette
       attestation
    </p> 

    <p  style="font-size: 16px" >
    <span style="font-weight: bold;text-decoration-line: underline">Réserve :</span>
    Dans le cas ou la pièce objet de ce certificat est montée pour fonctionner avec d’autres pièces tournantes 
    (Arbres, rotors, roulements….) qui n’auraient pas été mises à notre disposition en vue de notre prestation 
    d’équilibrage, le présent certificat n’engage pas notre responsabilité quant à l’état d’équilibre de l’ensemble 
    de l’équipement tournant comprenant la pièce objet de ce certificat.
    </p>


    <p  style="font-size: 16px;font-weight: bold" >    

                    136, Rue Allal Ben Ahmed Amkik (ex Ménil Montant) Belvédère - Casablanca
                    Tél : (06 61 14 24 58 Tél & Fax : (05 22)40.73.35 E-Mail:narepmehdi@live.com
                    R.C. 48667 – C.N.S.S. 1213222 – I.F 01600243 – Patente 31203956
    </p> 


  `;
    if (editor.current) {
      const view = editor.current.view;

      if (view) {
        EditorUtils.setHtml(view, content);
      }
    }
  }

  useIonViewDidEnter(() => {

  })


  const Save = () => {
    ls.set("pdfDataP1", P1data);
    ls.set("pdfDataP2", P2data);
    setShowModal(false);
    HtmlToPdf(false);
    MySwal.fire({
      position: 'top-center',
      icon: 'success',
      title: 'Data Saved successfully',
      showConfirmButton: false,
      timer: 3000
    })
  }

  setTimeout(() => {
    HtmlToPdf(true)
  }, 2000);

  const updateMessage = (e) => {
    let ID = e.id;
    if (e.deg) P1data[ID].Deg = e.deg
    if (e.mass) P1data[ID].Mass = e.mass;
  }

  const updateMessageP2 = (e) => {
    let ID = e.id;
    if (e.deg) P2data[ID].Deg = e.deg
    if (e.mass) P2data[ID].Mass = e.mass;
  }

  const load = () => {
    setShowModal(true)
  }


  return (
    <IonPage>
      <div className="printer">
        <div className="click" onClick={() => load()}></div>
        <IonModal isOpen={showModal} onDidDismiss={() => { Save() }} cssClass='ModalPrinter'>
          <div className="modalPrinter">
            <div className="table1">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th colSpan="2"><p >P1</p></th>
                  </tr>

                  <tr>
                    <th colSpan="1"><p >Degrés</p></th>
                    <th colSpan="1"><p >Masse</p></th>
                  </tr>
                </thead>

                <tbody>
                  {
                    P1data.map((column, i) => (
                      <tr key={i}>
                        <td colSpan="1"><input onChange={e => updateMessage({ id: i, deg: e.target.value })} /></td>
                        <td colSpan="1"><input onChange={e => updateMessage({ id: i, mass: e.target.value })} /></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            <div className="table2">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th colSpan="2"><p >P2</p></th>
                  </tr>

                  <tr>
                    <th colSpan="1"><p >Degrés</p></th>
                    <th colSpan="1"><p >Masse</p></th>
                  </tr>
                </thead>

                <tbody>
                  {
                    P2data.map((column, i) => (
                      <tr key={i}>
                        <td colSpan="1"><input onChange={e => updateMessageP2({ id: i, deg: e.target.value })} /></td>
                        <td colSpan="1"><input onChange={e => updateMessageP2({ id: i, mass: e.target.value })} /></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </IonModal>

        <LocalizationProvider language="fr">
          <Editor
            tools={[
              [Bold, Italic, Underline],
              [AlignLeft, AlignCenter, AlignRight],
              [OrderedList, UnorderedList, Indent, Outdent],
              [FindAndReplace, Pdf, Print],
            ]}
            contentStyle={{ height: 900, width: 1280 }}
            defaultContent={""}
            ref={editor}
          />
        </LocalizationProvider>
      </div>
    </IonPage>
  )
}

export default Printer
