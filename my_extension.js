const my_extension = (() => {

    async function startExtension() {
        try {
            const context = await common.getContext();
            const serviceCallId = context.viewState.selectedServiceCallId;
            const serviceCallType = await common.fetchServiceCallType(serviceCallId);       
            if (serviceCallType[0].typeCode !== '-7') {
                utils.setFieldValue('#info', 'Toto SV nie je typu Obhliadka a teda neobsahuje žiadne dáta na zobrazenie.');
            } else {
                // run the extension
                const generalData = await common.fetchGeneralData(serviceCallId);
                const skenData = await common.fetchSkenData(serviceCallId);
                const deviceData = await common.fetchDeviceData(serviceCallId);
                console.log("🚀 ~ startExtension ~ deviceData:", deviceData)
                const photos = await common.fetchPhotos(serviceCallId);
                console.log("🚀 ~ startExtension ~ photos:", photos)
                // const photosV2 = await common.fetchPhotosV2(serviceCallId);
                // console.log("🚀 ~ startExtension ~ photosV2:", photosV2)

                if (generalData) {
                    utils.fillStaticData(generalData[0], ['udoValueId','sluzba_internet', 'sluzba_internettv', 'bod_final', 'uspesna', 'narocnost', 'dovod_neuspech', 'individ_rozpocet', 'install_technik' ]);
                    utils.initSelectOptions('#narocnost', {'1':'1', '2':'2', '3':'3', '4':'4', '5':'5'}, generalData[0].narocnost , true);
                    utils.initSelectOptions('#uspesna', {'Úspešná': 'ANO','Neúspešná': 'NIE'}, generalData[0].uspesna, true);
                    utils.initSelectOptions('#install_technik', {'Áno':'ANO', 'Nie': 'NIE'}, generalData[0].install_technik, false );

                    utils.getDomElement('.save-button').addEventListener('click', async ()=> {
                      await common.saveChanges(generalData[0], deviceData, serviceCallId);
                    });
                    
                }
                if (skenData) {
                    utils.initSelectOptions('#bod_final', utils.getBodSelectionData(skenData), generalData[0].bod_final, false);
                    utils.createTableBody('#sken_table', ['bod', 'kapacita', 'ssid', 'frekvencia', 'vzdialenost', 'vysledok', 'datum'], skenData);
                }

                if (deviceData) {
                    utils.showDeviceData(deviceData); 
                }

                if (photos) {
                    photos.forEach(photoData => {
                        common.fetchPhoto(photoData);
                    });
                }

                if (generalData[0].stav == 'ZRIADITELNA' || generalData[0].stav == 'ZMENA_SLUZBY' || generalData[0].stav == 'NEZRIADITELNA') {
                    utils.disableEdit();
                }

                /***
                 * testing gps extraction
                 */
                const photoGPS = await gps_extractor.fetchPhotoIds(serviceCallId);
                console.log("🚀 ~ startExtension ~ photoGPS:", photoGPS)
                if (photoGPS) {
                    photoGPS.forEach(p => {
                        gps_extractor.getGPS(p);
                    })
                }
            }
        } catch (error) {
            console.log("🚀 ~ startExtension ~ error:", error)
            utils.setFieldValue('#error', error);
        }
    }

    return { startExtension }
})();