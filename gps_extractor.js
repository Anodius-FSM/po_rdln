const gps_extractor = (() => {

    function getGPS() {
        // const reader = new FileReader();
        // reader.onloadend = () => {
        //     //console.log(reader.result);
        //     const img = document.createElement('img');
        //     img.setAttribute('src', reader.result);
        //     console.log("🚀 ~ getGPS ~ img:", img);

        //     EXIF.getData(img, function() {
        //         var allMetaData = EXIF.getAllTags(this);
                
        //         let latitude = EXIF.getTag(this, 'GPSLatitude');
        //         let longitude =  EXIF.getTag(this, 'GPSLongitude');
                
        //         console.log("🚀 ~ EXIF.getData ~ allMetaData:", allMetaData)
        //         console.log("🚀 ~ EXIF.getData ~ latitude:", latitude)
        //         console.log("🚀 ~ EXIF.getData ~ longitude:", longitude)
        //     });

            
        // }

        const reader = new FileReader();
        reader.onloadend = () => {
            console.log(reader2.result);
            const data = EXIF.readFromBinaryFile(reader.result);
            if (data) {
                console.log(data);
            } else {
                console.log(`this isn't working`);
            }
        }
            
        (async () => {
            const imageBlob =  await common.fetchPhotoV2({description: '776A32D9CDB43AE36D5F9D009AE0E699', id: '776A32D9CDB43AE36D5F9D009AE0E699', type: 'JPEG'});
            //reader.readAsDataURL(imageBlob);  /** readAsArrayBuffer(imageBlob); */   
            reader.readAsArrayBuffer(imageBlob);
        })()
    }


    // function testGPS() {
    //     //const photo = await common.fetchPhotoV2({description: '29EBF883B53158BA6AFF91A06EB02285', id: '29EBF883B53158BA6AFF91A06EB02285', type: 'JPEG'})
    //     //console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~ img tag:");
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         const base64Data = reader.result;
    //         console.log("🚀 ~ testGPS ~ base64Data:");   
    //         let img = new Image();
            
            
    //         img.onload = () => {
                
    //                 EXIF.getData(base64Data, function() {
    //                     console.log('toto je v exifjs');
    //                     var allMetaData = EXIF.getAllTags(this);
                        
    //                     let latitude = EXIF.getTag(this, 'GPSLatitude');
    //                     let longitude =  EXIF.getTag(this, 'GPSLongitude');
                        
    //                     console.log("🚀 ~ EXIF.getData ~ allMetaData:", allMetaData)
    //                     console.log("🚀 ~ EXIF.getData ~ latitude:", latitude)
    //                     console.log("🚀 ~ EXIF.getData ~ longitude:", longitude)
    //                 });
              
                
    //         }

    //         img.src = base64Data;
            
            
    //     }

    //     (async () => {
    //         const imageBlob =  await common.fetchPhotoV2({description: '29EBF883B53158BA6AFF91A06EB02285', id: '29EBF883B53158BA6AFF91A06EB02285', type: 'JPEG'});
    //         setTimeout(()=>{
    //             reader.readAsDataURL(imageBlob);
    //         }, 15_000);
              
    //     })()
    // }

    return {
        getGPS
    }

})();
            
            
