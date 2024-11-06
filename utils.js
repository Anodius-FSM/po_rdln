const utils = (() => {

    const COLOR_MAP = new Map([
        ['PREBIEHA', '#FFFF00'],
        ['KONTROLA', '#FFFF00'],
        ['ZAPARKOVANE', '#FFA500'],
        ['ZRIADITELNA', '#008000'],
        ['ZMENA_SLUZBY ', '#008000'],
        ['NEZRIADITELNA', '#FF0000'],
        ['1', '#008000'],
        ['2', '#FFFF00'],
        ['3', '#FFA500'],
        ['4', '#ff8000'],
        ['5', '#FF0000'],
        ['ANO', '#66b266'],
        ['NIE', '#ff6666'],
        ['Úspešná', '#66b266'],
        ['Neúspešná', '#ff6666']
    ]);

    const DEVICE_TYP = new Map([
        ['KONZOLA_SAT', 'SAT konzola'],
        ['KONZOLA', 'Konzola/ Držiak'],
        ['ZARIADENIE', 'Zariadenie'],
        ['DRZIAK_BALKON', 'Držiak na satelit na balkón (vodorovná tyč)'],
        ['MATERIAL', 'Materiál'],
        ['DRZIAK_STA', 'Držiak na STA (zvislá tyč)']
    ]);
    const EDITABLE_FIELDS = ['sluzba_internet', 'sluzba_internettv', 'bod_final', 'install_technik', 'uspesna', 'narocnost', 'poznamka_kontrolora'];
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

    function closePopup() {
        getDomElement('.popup').style.display = 'none';
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
        getDomElement(imgId).onclick = (e) => {
            let modal = getDomElement('#myModal');
            // insert the image to the modal
            let modalImg = getDomElement('#img01');
            let captionText = getDomElement('#caption');
            modal.style.display = 'block';
            modalImg.src = e.srcElement.currentSrc;
            captionText.innerHTML = e.srcElement.alt;

        }

        // close the modal
        getDomElement('.close').onclick = () => {
            getDomElement('#myModal').style.display = 'none';
        }
    }

    function displayPhotos(id, description, blob) {
        const photoContainer = getDomElement('.photos');
        let img = document.createElement('img');
        img.setAttribute('id', `x${id}`); // add x before id => querySelector for ID :  cannot start with a digit
        img.classList.add('thumbnail');
        img.setAttribute('alt', description);
        let objUrl = URL.createObjectURL(blob);
        img.setAttribute('src', objUrl);

        photoContainer.appendChild(img);

        setUpModal(`#x${id}`);
    }

    function createTableBody(tableId, headerArray, data) {
        let table = getDomElement(tableId);

        data.forEach(d => {
            let row = table.insertRow(-1); // add a row at the end of the table
            headerArray.forEach((head, i) => {
                let cell = row.insertCell(i);
                cell.innerText = d[head];
            });
        });
    }

    function fillStaticData(inputData, toIgnore) {
        const inputKeys = Object.keys(inputData);
        const dataKeys = inputKeys.filter(k => !toIgnore.includes(k));

        dataKeys.forEach(key => {
            if (key === 'datum_vytvorenia') {
                getDomElement(`#${key}`).innerHTML = moment(inputData[key]).format('DD.MM.YYYY') || 'error';
            } else if (key === 'stav') {
                setBackgroundColor(`.${key}`, COLOR_MAP.get(inputData[key]));
                getDomElement(`#${key}`).innerHTML = inputData[key] || 'error';
            } else {
                getDomElement(`#${key}`).innerHTML = inputData[key] || 'error';
            }
        });
        if (inputData.dovod_neuspech === 'null') {
            getDomElement('.dovod_neuspech').remove();
            getDomElement('#dovod_neuspech').remove();
            getDomElement('#dov_neusp').remove();
        }

        if (inputData.sluzba_internet === 'true') {
            getDomElement('#sluzba_internet').checked = true;
        }

        if (inputData.sluzba_internettv === 'true') {
            getDomElement('#sluzba_internettv').checked = true;
        }
    }
    /**
     * 
     * @param {string} domId 
     * @param {*} data 
     * @param {boolean} useColors 
     */
    function initSelectOptions(domId, data, selectedValue, useColors) {
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
        if (selectedValue && useColors) {
            select.value = selectedValue;
            select.style.backgroundColor = COLOR_MAP.get(selectedValue);
        } else if (selectedValue && !useColors) {
            select.value = selectedValue;
        }

        select.addEventListener('change', () => {
            if (useColors && useColors) {
                select.style.backgroundColor = COLOR_MAP.get(select.value);
            }
        });
    }

    function showDeviceData(data) {
        let deviceData = '';
        data.forEach(d => {
            deviceData += `<tr><td class="device-typ">${DEVICE_TYP.get(d.typ)}<td>`;
            if (d.model !== 'null' && d.ine !== 'null') {
                deviceData += `<td class="center-align">${d.model} / ${d.ine}</td></tr>`;
            } else if (d.model !== 'null' && d.ine === 'null') {
                deviceData += `<td class="center-align">${d.model}</td></tr>`;
            } else if (d.model === 'null' && d.ine !== 'null') {
                deviceData += `<td class="center-align">${d.ine}</td></tr>`;
            }
        });

        getDomElement('#zar_mat').innerHTML = deviceData;
    }

    function getEditableFieldsValues() {
        let returnData = {};
        EDITABLE_FIELDS.forEach(field => {
            let fieldTag = getDomElement(`#${field}`);
            if (field === 'sluzba_internet' || field === 'sluzba_internettv') {
                returnData[field] = fieldTag.checked ? 'true' : 'false';
            } else {
                returnData[field] = fieldTag.value;
            }
        });

        return returnData;
    }

    return {
        getDomElement,
        setFieldValue,
        setUpModal,
        createTableBody,
        fillStaticData,
        initSelectOptions,
        getBodSelectionData,
        showDeviceData,
        displayPhotos,
        getEditableFieldsValues
    }
})();