const gps_extractor = (() => {

/** 
 * 
{description: '29EBF883B53158BA6AFF91A06EB02285', id: '29EBF883B53158BA6AFF91A06EB02285', type: 'JPEG'}
1
: 
{description: 'ABEFB65969E7FF2ECA36C288C755C85D', id: 'ABEFB65969E7FF2ECA36C288C755C85D', type: 'JPEG'}
2
: 
{description: '33DFD97B4BC20DA35A2BC55E2EBED0A5', id: '33DFD97B4BC20DA35A2BC55E2EBED0A5', type: 'JPEG'}
 * 
 * 
 */

    async function testGPS() {
        const photo = await common.fetchPhotoV2({description: '29EBF883B53158BA6AFF91A06EB02285', id: '29EBF883B53158BA6AFF91A06EB02285', type: 'JPEG'})
        console.log("🚀 ~ testGPS ~ photo:", photo)

        // let longitude = null;
        // let latitude = null;

        EXIF.getData(photo, function() {
            var allMetaData = EXIF.getAllTags(this);
            
            let latitude = EXIF.getTag(this, 'GPSLatitude');
            let longitude =  EXIF.getTag(this, 'GPSLongitude');
            
            console.log("🚀 ~ EXIF.getData ~ allMetaData:", allMetaData)
            console.log("🚀 ~ EXIF.getData ~ latitude:", latitude)
            console.log("🚀 ~ EXIF.getData ~ longitude:", longitude)
        });
        
    }

    return {
        testGPS
    }

})();