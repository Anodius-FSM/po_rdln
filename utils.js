/**
 * some sample util functions...
 */

const utils = (() => {

    const COLOR_MAP = new Map([
        ['PREBIEHA', '#FFFF00' ],
        ['KONTROLA', '#FFFF00'],
        ['ZAPARKOVANE', '#FFA500'],
        ['ZRIADITELNA', '#008000'],
        ['ZMENA_SLUZBY ', '#008000'],
        ['NEZRIADITELNA', '#FF0000'],
        ['1','#008000'],
        ['2','#FFFF00'],
        ['3','#FFA500'], 
        ['4','#ff8000'],
        ['5','#FF0000'],
        ['ANO', '#66b266'],
        ['NIE', '#ff6666'],
        ['Úspešná', '#66b266'],
        ['Neúspešná', '#ff6666']
    ]);
    /**
     * Úspešná': 'ANO','Neúspešná
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
    function setBackgroundColor(selector, color) {
        getDomElement(selector).style.backgroundColor = color;
    }
    function getBodSelectionData(skenData) {
        const bodSet = new Set();
        skenData.forEach(sken => bodSet.add((sken.bod).split(' ')[0]));

        let retObj = {};
        bodSet.forEach((value1, value2) => retObj[value1] = value2); 
        return retObj;
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

    function createTableBody(tableId, headerArray, data) {
        let table = getDomElement(tableId);

        data.forEach(d => {
            let row = table.insertRow(-1); // add a row at the end of the table
            headerArray.forEach((head, i ) => {
                let cell = row.insertCell(i);
                cell.innerText = d[head]; 
            });
        });
    }

    function fillStaticData(inputData, toIgnore) {
        const inputKeys = Object.keys(inputData);
        const dataKeys = inputKeys.filter(k => !toIgnore.includes(k));

        dataKeys.forEach(key => {
            if ( key === 'datum_vytvorenia') {               
                getDomElement(`#${key}`).innerHTML = moment(inputData[key]).format('DD.MM.YYYY') || 'error';
            } else if (key === 'stav') {
                setBackgroundColor(`.${key}`, COLOR_MAP.get(inputData[key]));
                getDomElement(`#${key}`).innerHTML = inputData[key] || 'error';
            } else {
                getDomElement(`#${key}`).innerHTML = inputData[key] || 'error';
            }
        });
    }
    /**
     * 
     * @param {string} domId 
     * @param {*} data 
     * @param {boolean} useColors 
     */
    function initSelectOptions(domId, data, selectedValue, useColors ) {
        const select = getDomElement(domId);
        for (let key in data) {
            let option = document.createElement('option');
            option.setAttribute('value', data[key]);
            if (useColors) {
                option.style.backgroundColor = COLOR_MAP.get(key);
            }

            let optionText = document.createTextNode(key);
            option.appendChild(optionText);
            select.appendChild(option);
        }
        if (selectedValue) {
            select.value = selectedValue;
            select.style.backgroundColor = COLOR_MAP.get(selectedValue);
        }

        select.addEventListener('change', () => {
            if (useColors) {
                select.style.backgroundColor = COLOR_MAP.get(select.value);
            }
        });
    }

    function showDeviceData(data) {
        let deviceData = '';
        data.forEach(d => {
            //deviceData += d.ine ? `<p></p>` : `<p></p>`;
            if (d.model !== 'null' && d.ine !== 'null') {
                deviceData += `<p>${d.model} / ${d.ine}</p>`;
            } else if (d.model !== 'null' && d.ine === 'null')  {
                deviceData += `<p>${d.model}</p>`
            } else if (d.model === 'null' && d.ine !== 'null') {
                deviceData += `<p>${d.ine}</p>`;
            }
        });

        getDomElement('#zar_mat').innerHTML = deviceData;
    }

    return {
        setFieldValue,
        setUpModal,
        createTableBody,
        fillStaticData,
        initSelectOptions,
        getBodSelectionData,
        showDeviceData
    }
})();