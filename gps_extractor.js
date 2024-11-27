const gps_extractor = (() => {

/** 
 * https://github.com/exif-js/exif-js/tree/master
 * https://github.com/exif-js/exif-js/blob/master/exif.js
 * https://dev.exiv2.org/boards/3/topics/2993
 * https://stackoverflow.com/questions/tagged/exif-js
 * https://code.flickr.net/2012/06/01/parsing-exif-client-side-using-javascript-2/
 * https://www.google.com/search?q=EXIF.readFromBinaryFile&sca_esv=6dc47f100a9e83c4&source=hp&ei=nsVGZ_ecJdy5i-gP-Iel8AY&iflsig=AL9hbdgAAAAAZ0bTrn7lb0im7CR1BClpPCAk7wGpzt-Y&ved=0ahUKEwj3472n-vuJAxXc3AIHHfhDCW4Q4dUDCA4&oq=EXIF.readFromBinaryFile&gs_lp=Egdnd3Mtd2l6IhdFWElGLnJlYWRGcm9tQmluYXJ5RmlsZTIEEAAYHkjPI1CaB1iaB3ABeACQAQCYATigATiqAQExuAEMyAEA-AEC-AEBmAICoAI_qAIKwgIKEAAYAxjqAhiPAcICChAuGAMY6gIYjwGYAwWSBwEyoAfoAQ&sclient=gws-wiz
 * https://stackoverflow.com/questions/24010310/using-exif-and-binaryfile-get-an-error
 * https://stackblitz.com/edit/exif?file=app%2Fapp.component.ts
 * 
 * 
 * 
{description: '29EBF883B53158BA6AFF91A06EB02285', id: '29EBF883B53158BA6AFF91A06EB02285', type: 'JPEG'}
1
: 
{description: 'ABEFB65969E7FF2ECA36C288C755C85D', id: 'ABEFB65969E7FF2ECA36C288C755C85D', type: 'JPEG'}
2
: 
{description: '33DFD97B4BC20DA35A2BC55E2EBED0A5', id: '33DFD97B4BC20DA35A2BC55E2EBED0A5', type: 'JPEG'}
 *  https://getaround.tech/exif-data-manipulation-javascript/
 * 
 */
    function getGPS() {
        const reader = new FileReader();
        reader.onloadend = () => {
            const data = EXIF.readFromBinaryFile(reader.result);
            if (data) {
                console.log(data);
            } else {
                console.log(`this isn't working`);
            }
        }

        (async () => {
            const imageBlob =  await common.fetchPhotoV2({description: '29EBF883B53158BA6AFF91A06EB02285', id: '29EBF883B53158BA6AFF91A06EB02285', type: 'JPEG'});
            reader.readAsArrayBuffer(imageBlob);  
        })()
    }



    function testGPS() {
        //const photo = await common.fetchPhotoV2({description: '29EBF883B53158BA6AFF91A06EB02285', id: '29EBF883B53158BA6AFF91A06EB02285', type: 'JPEG'})
        //console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~ img tag:");
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result;
            console.log("🚀 ~ testGPS ~ base64Data:");   
            let img = new Image();
            
            
            img.onload = () => {
                EXIF.getData(base64Data, function() {
                    console.log('toto je v exifjs');
                    var allMetaData = EXIF.getAllTags(this);
                    
                    let latitude = EXIF.getTag(this, 'GPSLatitude');
                    let longitude =  EXIF.getTag(this, 'GPSLongitude');
                    
                    console.log("🚀 ~ EXIF.getData ~ allMetaData:", allMetaData)
                    console.log("🚀 ~ EXIF.getData ~ latitude:", latitude)
                    console.log("🚀 ~ EXIF.getData ~ longitude:", longitude)
                });
            }

            img.src = base64Data;
            
            
        }

        (async () => {
            const imageBlob =  await common.fetchPhotoV2({description: '29EBF883B53158BA6AFF91A06EB02285', id: '29EBF883B53158BA6AFF91A06EB02285', type: 'JPEG'});
            reader.readAsDataURL(imageBlob);  
        })()



        //https://thewebdev.info/2021/10/12/how-to-convert-a-blob-to-a-base64-string-with-javascript/
        // let longitude = null;
        // let latitude = null;

        // let image = new Image();
        // image.src = URL.createObjectURL(photo);
        // console.log("🚀 ~ testGPS ~ image:", image);

        // let reader = new FileReader();
        // reader.readAsDataURL(photo);
        // reader.onloadend = () => {
        //     let base64string = reader.result;
        //     console.log("🚀 ~ testGPS ~ base64string:", base64string);
        //     let image = new Image();
        //     image.src = base64string;

        //     let img = document.createElement('img');
        //     img.setAttribute('src', base64string);
            
        //     EXIF.getData(img, function() {
        //         var allMetaData = EXIF.getAllTags(this);
                
        //         let latitude = EXIF.getTag(this, 'GPSLatitude');
        //         let longitude =  EXIF.getTag(this, 'GPSLongitude');
                
        //         console.log("🚀 ~ EXIF.getData ~ allMetaData:", allMetaData)
        //         console.log("🚀 ~ EXIF.getData ~ latitude:", latitude)
        //         console.log("🚀 ~ EXIF.getData ~ longitude:", longitude)
        //     });
        // }
    }

    return {
        testGPS,
        getGPS
    }

})();
            
            
