
/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.info("Script started successfully");

let currentPopup: any = undefined;

WA.onInit().then(async () => {

    console.info("Scripting API ready");

    WA.room.area.onEnter("clock").subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    });

    WA.room.area.onLeave("clock").subscribe(closePopup);

    bootstrapExtra().then(() => {
        console.info("Scripting API Extra ready");
    }).catch(e => console.error(e));

    // Terra-Fonds-Uhr aus Tiled übernehmen

    const map = await WA.room.getTiledMap();

    function findObject(
        layers: any[],
        offsetX = 0,
        offsetY = 0
    ): any {

        for (const layer of layers) {

            const x = offsetX + (layer.offsetx || 0);
            const y = offsetY + (layer.offsety || 0);

            if (layer.type === "objectgroup") {

                const obj = layer.objects.find(
                    (o: any) => o.name === "terraFondsUhr"
                );

                if (obj) {
                    return {
                        ...obj,
                        x: obj.x + x,
                        y: obj.y + y
                    };
                }
            }

            if (layer.type === "group") {

                const result = findObject(layer.layers, x, y);

                if (result) return result;
            }
        }

        return undefined;
    }

    const obj = findObject(map.layers);

    if (!obj) return;

    const url = obj.properties?.find(
        (p: any) => p.name === "url"
    )?.value;

    if (!url) {
        console.error("Terra-Fonds-Uhr: URL fehlt");
        return;
    }

    WA.room.website.create({
        name: "terra-fonds-uhr",
        url: url,
        position: {
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height
        },
        visible: true,
        allowApi: false,
        allow: "",
        origin: "map",
        scale: 1
    });

    console.info("Terra-Fonds-Uhr aus Tiled erstellt", obj);

}).catch(e => console.error(e));

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
