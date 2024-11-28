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

    function getGPS(photoData) {
        const reader = new FileReader();
        reader.onloadend = () => {
            console.log(reader.result);
            const data = EXIF.readFromBinaryFile(reader.result);
            if (data) {
                console.log(data);
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

        //let latitude = latitudeData.reduce((acc, data) => { return acc += data.numerator / data.denominator }, 0);
        //let longitude = latitudeData.reduce((acc, data) => { return acc += data.numerator / data.denominator }, 0);

        let latitude = latiData[0].numerator / latiData[0].denominator + latiData[1].numerator / latiData[1].denominator / 60  +  latiData[2].numerator / latiData[2].denominator / 3600;
        let longitude = longData[0].numerator / longData[0].denominator + longData[1].numerator / longData[1].denominator / 60  +  longData[2].numerator / longData[2].denominator / 3600;

        console.log("🚀 ~ getCoordinates ~ longitude:", longitude)
        console.log("🚀 ~ getCoordinates ~ latitude:", latitude)
        return {latitude, longitude}
    }

    return {
        fetchPhotoIds,
        getGPS
    }

})();


