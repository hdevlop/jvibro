import tt from '../../assets/images/tt.png'
import * as ls from "local-storage";

var arrayMagP1 = ls.get("CorrMagP1");
var arrayAngP1 = ls.get("CorrAngP1");

var arrayMagP2 = ls.get("CorrMagP2");
var arrayAngP2 = ls.get("CorrAngP2");


var textMagP1 = "";
var textAngP1 = "";
var textMagP2 = "";
var textAngP2 = "";
var textMagP1Rest = ""
var textMagP2Rest = ""
//==============================================================//

if(arrayMagP1.length){
    for (let i = 0; i < arrayMagP1.length; i++) {
        textMagP1 += arrayMagP1[i] + "g" + "<br>";
    }
    
    for (let i = 0; i < arrayMagP1.length; i++) {
        textAngP1 += arrayAngP1[i] + "°" + "<br>";
    }
    textMagP1Rest = arrayMagP1[arrayMagP1.length - 1] + "g" ;
}

//==============================================================//

if(arrayMagP2.length){
    for (let i = 0; i < arrayMagP1.length; i++) {
        textMagP2 += arrayMagP2[i] + "g" + "<br>";
    }
    
    for (let i = 0; i < arrayMagP1.length; i++) {
        textAngP2 += arrayAngP2[i] + "°" + "<br>";
    }
    textMagP2Rest = arrayMagP2[arrayMagP2.length - 1] + "g" ;
}
//==============================================================//

const content = `
    <img src=${tt} alt="Girl in a jacket" width="720" height="100">
   
    <p  style="font-size: 14px" >   Casablanca, le </p>
    <p  style="font-size: 14px" >   V/REF : BC N° : Verbal </p>
    <p  style="font-size: 14px" >   N/REF : NR :  </p>                                                                                                                                                
    <p  style="font-size: 14px" >   Objet : Attestation d’équilibrage  </p> 
    <p  style="font-size: 14px" >   Par la présente, nous, la Société NAREP, attestons que le matériel présenté dans la rubrique désignation a été équilibré comme
   il est décrit dans les colonnes P1 et P2.
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
            <th colspan="1"><p style="font-weight: bold;text-decoration-line: underline">Equilibrage:</p></th>
            <th colspan="1">
                <p style="text-align:center">${textAngP1}</p>
            </th>
            <th colspan="1">
                <p style="text-align:center">${textMagP1}</p>
            </th>
            <th colspan="1">
                <p style="text-align:center">${textMagP1Rest}</p>
            </th>

            <th colspan="1">
                <p style="text-align:center">${textAngP2}</p>
            </th>
            <th colspan="1">
                <p style="text-align:center">${textMagP2}</p>
            </th>
            <th colspan="1">
                <p style="text-align:center">${textMagP2Rest}</p>
            </th>
        </tr>

    </TABLE>

    <p  style="font-size: 14px" >



    <span style="font-weight: bold;text-decoration-line: underline">N.B :</span>  (Pour éviter les contestations)</p> 

    <p  style="font-size: 14px" >    1/ Toute modification apportée par nos soins sur la pièce à équilibrer (masse ajoutée ou partie touchée par enlèvement 
        de matière) est peinte par nos soins avec de la peinture Bleue

    2/ Toute pièce équilibrée par nos soins est marquée du N° du dossier, tel que cité dans la 1ère Colonne de cette attestation
    </p> 



    <p  style="font-size: 14px" >
    <span style="font-weight: bold;text-decoration-line: underline">Réserve :</span>
    Dans le cas ou la pièce objet de ce certificat est montée pour fonctionner avec d’autres pièces tournantes 
    (Arbres, rotors, roulements….) qui n’auraient pas été mises à notre disposition en vue de notre prestation 
    d’équilibrage, le présent certificat n’engage pas notre responsabilité quant à l’état d’équilibre de l’ensemble 
    de l’équipement tournant comprenant la pièce objet de ce certificat.
    </p>





    <p  style="font-size: 16px" >    

                    136, Rue Allal Ben Ahmed Amkik (ex Ménil Montant) Belvédère - Casablanca
                    Tél : (06 61 14 24 58 Tél & Fax : (05 22)40.73.35 E-Mail:narepmehdi@live.com
                    R.C. 48667 – C.N.S.S. 1213222 – I.F 01600243 – Patente 31203956
    </p> 


    `;



export default content;
