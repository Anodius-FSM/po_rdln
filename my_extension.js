const my_extension = (() => {

    async function startExtension() {
        try {
            const context = await common.getContext();
            const serviceCallId = context.viewState.selectedServiceCallId;
            const serviceCallType = await common.fetchServiceCallType(serviceCallId);
            if (serviceCallType[0].typeCode !== '-7') {
                utils.getDomElement('#general_content').remove();
                utils.getDomElement('#fotky').remove();
                utils.getDomElement('#sken').remove();
                utils.setFieldValue('#info', 'Toto SV nie je typu Obhliadka a teda neobsahuje žiadne dáta na zobrazenie.');
            } else {
                // run the extension
                const generalData = await common.fetchGeneralData(serviceCallId);
                if (generalData.length === 0) {
                    utils.setFieldValue('#info', 'Obhliadka ešte nebola vykonaná, neexistujú žiadne dáta na zobrazenie');
                    utils.getDomElement('.general_content').remove();
                    utils.getDomElement('.sken').remove();
                    utils.getDomElement('#fotky').remove();
                } else {

                    const skenData = await common.fetchSkenData(serviceCallId);
                    const deviceData = await common.fetchDeviceData(serviceCallId);
                    const photos = await common.fetchPhotos(serviceCallId);

                    if (generalData) {
                        utils.fillStaticData(generalData[0], ['udoValueId', 'sluzba_internet', 'sluzba_internettv', 'bod_final', 'uspesna', 'narocnost', 'dovod_neuspech', 'individ_rozpocet', 'install_technik']);
                        utils.initSelectOptions('#narocnost', {
                            '1 - Nenáročné': '1 - Nenáročné',
                            '2 - Málo náročné': '2 - Málo náročné',
                            '3 - Stredne náročné': '3 - Stredne náročné',
                            '4 - Náročné': '4 - Náročné',
                            '5 - Veľmi náročné': '5 - Veľmi náročné'
                        }, generalData[0].narocnost, true);
                        //utils.initSelectOptions('#uspesna', { 'Úspešná': 'Úspešná', 'Neúspešná': 'Neúspešná' }, generalData[0].uspesna, true);
                        utils.initSelectOptions('#uspesna', { 'Zriaditeľná': 'Zriaditeľná', 'Nezriaditeľná': 'Nezriaditeľná' }, generalData[0].uspesna, true);
                        utils.initSelectOptions('#install_technik', { 'Áno': 'Áno', 'Nie': 'Nie' }, generalData[0].install_technik, false);

                        utils.getDomElement('.save-button').addEventListener('click', async () => {
                            await common.saveChanges(generalData[0], deviceData, serviceCallId);
                        });

                    }
                    if (skenData) {
                        utils.initSelectOptions('#bod_final', utils.getBodSelectionData(skenData, generalData[0].bod_final), generalData[0].bod_final, false);
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
                     * get GPS coordinates
                     */
                    if (utils.getDomElement('#gps_suradnice').innerHTML == 'null' || utils.getDomElement('#gps_suradnice').innerHTML == ''  ) {
                        const photoGPS = await gps_extractor.fetchPhotoIds(serviceCallId);
                        if (photoGPS) {
                            if (utils.getDomElement('#gps_suradnice').innerHTML == 'null' || utils.getDomElement('#gps_suradnice').innerHTML == '') {
                                photoGPS.some(async p => {
                                    if (utils.getDomElement('#gps_suradnice').innerHTML != 'null' && utils.getDomElement('#gps_suradnice').innerHTML != '') {
                                        return true;
                                    }
                                    await gps_extractor.getGPS(p, generalData[0].udoValueId);
                                })
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log("🚀 ~ startExtension ~ error:", error)
            utils.setFieldValue('#error', error);
        }
    }

    return { startExtension }
})();