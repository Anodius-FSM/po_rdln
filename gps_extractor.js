const gps_extractor = (() => {

    async function fetchPhotoIds(serviceCallId) {
        const response = await fetch(
            'https://eu.fsm.cloud.sap/api/query/v1?' + new URLSearchParams({
                ...await common.getSearchParams(),
                dtos: 'ServiceCall.27;Activity.43;Attachment.19;ChecklistInstance.20;ChecklistInstanceElement.24'
            }), {
            method: 'POST',
            headers: await common.getHeaders(),
            body: JSON.stringify({
                query: `SELECT at.id AS id,
                               at.type AS type 
	                        FROM ChecklistInstanceElement cie 
	                        JOIN Attachment at ON cie.object = at.id 
                            JOIN ChecklistInstance ci ON cie.checklistInstance = ci.id 
                            JOIN Activity ac ON ci.object = ac.id 
                        WHERE cie.parentElementId = 'foto_obhliadka' AND 
	                        ac.object.objectId = '${serviceCallId}' AND 
	                        cie.value <> '' AND 
                            cie.value IS NOT NULL AND 
                            at.type IN ('JPG', 'JPEG') 
                            ORDER BY cie.index DESC LIMIT 3`})
        }
        );
        if (!response.ok) {
            console.log("🚀 ~ fetchPhotos ~ response:", response);
            throw new Error(`🚀🚀🚀 Failed to fetch photo data, got status ${response.status}`);
        }

        return (await response.json()).data;
    }

    async function getGPS(photoData, uvId) {
        const reader = new FileReader();
        reader.onloadend = async () => {
            console.log(reader.result);
            const data = EXIF.readFromBinaryFile(reader.result);
            if (data) {
                console.log(data);
                let coordinates = getCoordinates(data)
                console.log("🚀 ~ getGPS ~ coord:", coordinates)
                if (coordinates.latitude && coordinates.longitude) {
                    const gpsResponse = await updateGPS( uvId, coordinates);
                    if (gpsResponse) {
                        utils.getDomElement('#gps_suradnice').innerHTML = `${coordinates.latitude}, ${coordinates.longitude}`;
                    }
                }
            } else {
                console.log(`this isn't working`);
            }
        }

        (async () => {
            const imageBlob = await common.fetchPhotoV2(photoData);
            reader.readAsArrayBuffer(imageBlob);
        })()
    }

    function getCoordinates(exifData) {
        const latiData = [...exifData['GPSLatitude']]; // north - south
        const longData = [...exifData['GPSLongitude']]; // west - east

        let latitude = latiData[0].numerator / latiData[0].denominator + latiData[1].numerator / latiData[1].denominator / 60 + latiData[2].numerator / latiData[2].denominator / 3600;
        let longitude = longData[0].numerator / longData[0].denominator + longData[1].numerator / longData[1].denominator / 60 + longData[2].numerator / longData[2].denominator / 3600;

        return { latitude, longitude };
    }

    async function updateGPS(udoValueId, coordinates) {
        const udfMetaFieldName = await common.fetchUdfMetaByFieldName(['z_f_obh_gps']);
        console.log("🚀 ~ updateGPS ~ udfMetaFieldName:", udfMetaFieldName)

        const updates = [{
            id: udoValueId,
            udfValues: [{
                meta: { id: udfMetaFieldName[0].id },
                value: `${coordinates.latitude}, ${coordinates.longitude}`
            }]
        }];

        const updateResponse = await fetch(
            'https://eu.fsm.cloud.sap/api/data/v4/UdoValue/bulk?' + new URLSearchParams({
                ...await common.getSearchParams(),
                dtos: 'UdoValue.10',
                forceUpdate: true
            }), {
            method: 'PATCH',
            headers: await common.getHeaders(),
            body: JSON.stringify(updates)
        });

        if (!updateResponse.ok) {
            return null;
        } else {
            return 1;
        }

    }

    return {
        fetchPhotoIds,
        getGPS
    }

})();


