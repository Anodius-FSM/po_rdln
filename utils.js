/**
 * some sample util functions...
 */

const utils = (() => {
    /**
     * 
     * @param {string} id: DOM elements id 
     * @param {string} value: value of the selected element  
     */
    function setFieldValue(id, value) {
        getDomElement(id).textContent = value;
    }
    /**
     * 
     * @param {string} id: DOM elements id 
     */
    function getDomElement(id) {
        return document.querySelector(id);
    }
    /**
     * 
     * @param {[string]} imgId 
     */
    function setUpModal(imgId) {
        // let img = getDomElement(imgId);
        imgId.forEach(iId => {
            getDomElement(iId).onclick = (e) => {
                let modal = getDomElement('#myModal');
                // insert the image to the modal
                let modalImg = getDomElement('#img01');
                let captionText = getDomElement('#caption')
                
                modal.style.display = 'block';
                modalImg.src = e.srcElement.currentSrc;
                captionText.innerHTML = e.srcElement.alt;
            }
        });

        // close the modal
        getDomElement('.close').onclick = () => {
            getDomElement('#myModal').style.display = 'none';
        }
    }

    return {
        setFieldValue,
        setUpModal
    }
})();