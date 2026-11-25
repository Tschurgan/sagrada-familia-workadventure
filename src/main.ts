/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.info('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.info('Scripting API ready');
    console.info('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.info('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
WA.onInit().then(() => {
    if (decodeURIComponent(WA.room.id)
        .includes("Innenraum kleiner")) {

        WA.room.website.create({
            name: "terra-fonds-uhr",
            url: "https://affentennis.com/?wagt_board=1",
            position: {
                x: 1032,
                y: 545.333,
                width: 384,
                height: 256
            },
            visible: true,
            allowApi: false,
            allow: "",
            origin: "map",
            scale: 1
        });

        console.info("Terra-Fonds-Uhr erstellt");
    }
}).catch(e => console.error(e));
