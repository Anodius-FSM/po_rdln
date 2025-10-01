const utils = (() => {

    const COLOR_MAP = new Map([
        ['PREBIEHA', '#f5ef7a'],
        ['KONTROLA', '#f5ef7a'],
        ['ZAPARKOVANE', '#f5a77a'],
        ['ZRIADITELNA', '#A9DFBF'],
        ['ZMENA_SLUZBY ', '#A9DFBF'],
        ['NEZRIADITELNA', '#F57A7A'],
        ['1', '#A9DFBF'],
        ['2', '#f5ef7a'],
        ['3', '#f5a77a'],
        ['4', '#F5957A'],
        ['5', '#F57A7A'],
        ['1 - Nenáročné', '#A9DFBF'],
        ['2 - Málo náročné', '#f5ef7a'],
        ['3 - Stredne náročné', '#f5a77a'],
        ['4 - Náročné', '#F5957A'],
        ['5 - Veľmi náročné', '#F57A7A'],
        ['Áno', '#66b266'],
        ['Nie', '#ff6666'],
        ['ANO', '#66b266'],
        ['NIE', '#ff6666'],
        ['Zriaditeľná', '#A9DFBF'],
        ['Nezriaditeľná', '#F57A7A']
    ]);

    const STAV_MAP = new Map([
        ['NEZRIADITELNA', 'Nezriaditeľná'],
        ['ZAPARKOVANE', 'Zaparkované'],
        ['ZMENA_SLUZBY', 'Zriad. so zmenou služby'],
        ['KONTROLA', 'Kontrola'],
        ['PREBIEHA', 'Prebieha'],
        ['ZRIADITELNA', 'Zriaditeľná']
    ]);

    const DEVICE = new Map([
        ['', ''],
        ['MikroTik nRAY 60G', 'ZARIADENIE'],
        ['LiteBeam 5AC-23dBI', 'ZARIADENIE'],
        ['LiteBeam 5AC Long-Range', 'ZARIADENIE'],
        ['NanoBeam 5AC - 16dBi', 'ZARIADENIE'],
        ['Konzola KM200', 'MATERIAL'],
        ['Konzola KM300', 'MATERIAL'],
        ['Držiak satelitný na stenu 25cm', 'MATERIAL'],
        ['Držiak satelitný na stenu 35cm', 'MATERIAL'],
        ['Držiak satelitný na stenu 50cm', 'MATERIAL'],
        ['Držiak na satelit na balkón 20 cm', 'MATERIAL'],
        ['Držiak na satelit na balkón 30 cm', 'MATERIAL'],
        ['Držiak na satelit na balkón 50 cm', 'MATERIAL'],
        ['Držiak na satelit na stožiar 25cm', 'MATERIAL'],
        ['Držiak na satelit na stožiar 35cm', 'MATERIAL'],
        ['Držiak na satelit na stožiar 50cm', 'MATERIAL'],
        ['Konzola ASTA 30T', 'MATERIAL'],
        ['Konzola ASTA 30 štvorec', 'MATERIAL'],
        ['Konzola ASTA 70 SN', 'MATERIAL'],
        ['Anténny držiak pod škridlu 550x400 staviteľný SN', 'MATERIAL'],
        ['Nadstavec stožiarový s vinklom 120cm d=2,8cm SN', 'MATERIAL'],
        ['Držiak 25cm k oknu pravý SN', 'MATERIAL'],
        ['Držiak 25cm k oknu ľavý SN', 'MATERIAL'],
        ['Konzola na kváder', 'MATERIAL'],
        ['Obruč na komín', 'MATERIAL'],
        ['Ethernetový kábel', 'MATERIAL'],
        ['Iné', 'INE']
    ]);

    const EDITABLE_FIELDS = ['sluzba_internet', 'sluzba_internettv', 'bod_final', 'install_technik',
        'uspesna', 'narocnost', 'poznamka_kontrolora', 'rebrik', 'max_rychlost', 'pocet_technikov', 'cas_install',
        'poznamka_technika', 'individ_rozpocet'];
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
    function getDomElements(className) {
        return document.querySelectorAll(className);
    }
    function setBackgroundColor(selector, color) {
        getDomElement(selector).style.backgroundColor = color;
    }

    function closePopup(id) {
        getDomElement(id).style.display = 'none';
        if (id === '#final_bod_popup') {
            readNewBodPopupData(id);
        } else {
            readPopupDeviceData(id);
        }
    }

    function cancelPopup(id) {
        getDomElement(id).style.display = 'none';
    }

    function getMapKeys(map, val) {
        return [...map].find(([key, value]) => val === value)[0];
    }

    /* When the user clicks on the button, 
        toggle between hiding and showing the dropdown content */
    function showDropdown() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    function getUiStavValue() {
        return getMapKeys(STAV_MAP, getDomElement('#stav').innerHTML);
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    function selectStav(event) {
        const selectedId = event.currentTarget.id;
        getDomElement('#myDropdown').classList.toggle("show");
        // get id of selected stav, get the button -> add class for color and change innerHtml to new Text
        // Button ID = STAV
        getDomElement('#stav').innerHTML = STAV_MAP.get(selectedId);
        getDomElement('#stav').style.backgroundColor = COLOR_MAP.get(selectedId);

        if (selectedId === 'KONTROLA') {
            let saveButton = getDomElement('#save_button');
            if (saveButton.disabled) { saveButton.disabled = false; }
        }
    }

    function getBodSelectionData(skenData, finalBod) {
        const bodSet = new Set();
        skenData.forEach(sken => bodSet.add((sken.bod).split(' ')[0]));

        let retObj = {};
        if (finalBod && finalBod != 'null') {
            retObj[finalBod] = finalBod;
        }
        bodSet.forEach((value1, value2) => retObj[value1] = value2);
       
        return retObj;
    }
    function goForward(next = 0) {
        let nextIndex = 0;
        let imgTagsToNavigate = [...getDomElements('.navigate_img')];
        let imgToNavigate = [];
        imgTagsToNavigate.forEach(i => {
            imgToNavigate.push({ id: i.getAttribute('data-id'), description: i.getAttribute('data-description'), src: i.src })
        });

        let actualImg = getDomElement('#img01');

        if (next != 0) {
            nextIndex = next;
        } else {
            let actualId = actualImg.getAttribute('data-id')

            let lastIndex = imgToNavigate.length - 1;
            let currentIndex = imgToNavigate.map(e => e.id).indexOf(actualId);
            nextIndex = currentIndex != lastIndex ? currentIndex + 1 : 0;
        }

        let captionText = getDomElement('#caption');
      
        actualImg.src = imgToNavigate[nextIndex].src;
        actualImg.setAttribute('data-id', imgToNavigate[nextIndex].id);
        captionText.innerHTML = imgToNavigate[nextIndex].description;
    }
    //let nextIndex = currentIndex != 0 ? currentIndex - 1 : lastIndex;
    function goBackward() {
        let imgTagsToNavigate = [...getDomElements('.navigate_img')];
        let imgToNavigate = [];
        imgTagsToNavigate.forEach(i => {
            imgToNavigate.push({ id: i.getAttribute('data-id'), description: i.getAttribute('data-description'), src: i.src })
        });
        
        let actualImg = getDomElement('#img01');
        let actualId = actualImg.getAttribute('data-id')

        let lastIndex = imgToNavigate.length - 1;
        let currentIndex = imgToNavigate.map(e => e.id).indexOf(actualId);

        let nextIndex = currentIndex != 0 ? currentIndex - 1 : lastIndex;

        let captionText = getDomElement('#caption');

        actualImg.src = imgToNavigate[nextIndex].src;
        actualImg.setAttribute('data-id', imgToNavigate[nextIndex].id);
        captionText.innerHTML = imgToNavigate[nextIndex].description;
    }

    async function deletePhoto() {
        //deletePhoto
        let photoToDelete = getDomElement('#img01')
        let idToDelete = photoToDelete.getAttribute('data-id')
        let imgTagsToNavigate = [...getDomElements('.navigate_img')];
        let imgToNavigate = [];
        imgTagsToNavigate.forEach(i => {
            imgToNavigate.push({ id: i.getAttribute('data-id'), description: i.getAttribute('data-description'), src: i.src })
        });
        let lastIndex = imgToNavigate.length - 1;
        let currentIndex = imgToNavigate.map(e => e.id).indexOf(idToDelete);
        let imgToLoadAfterDelete = currentIndex != lastIndex ? currentIndex + 1 : 0;
        closePopup('#delete_photo_popup');
        const deleted = await common.deletePhoto(idToDelete);

        if (deleted) {
            //photoToDelete.remove();
            getDomElement(`#x${idToDelete}`).remove();
            goForward(imgToLoadAfterDelete - 1); // the photo from the array is now gone, so the next photos index is 1 less   
        }
    }
    /**
     * 
     * @param {[string]} imgId 
     */
    function setUpModal(imgId, navId) {
        getDomElement(imgId).onclick = (e) => {
            let modal = getDomElement('#myModal');
            // insert the image to the modal
            let modalImg = getDomElement('#img01');
            let captionText = getDomElement('#caption');
            modal.style.display = 'block';
            modalImg.src = e.srcElement.currentSrc;
            modalImg.setAttribute('data-id', `${navId}`);
            captionText.innerHTML = e.srcElement.alt;
        }

        // close the modal
        getDomElement('.close').onclick = () => {
            getDomElement('#myModal').style.display = 'none';
        }

        getDomElement('.deleteImg').onclick = () => {
            utils.getDomElement('#delete_photo_popup').style.display = 'block';
        }
    }

    async function displayPhotos(id, description, blob) {  //id, description, blob
        const photoContainer = getDomElement('.photos');
        let img = document.createElement('img');
        img.setAttribute('class', 'navigate_img');
        img.setAttribute('id', `x${id}`); // add x before id => querySelector for ID :  cannot start with a digit
        img.setAttribute('data-id', `${id}`);
        img.setAttribute('data-description', `${description}`);

        img.classList.add('thumbnail');
        img.setAttribute('alt', description);
        let objUrl = URL.createObjectURL(blob);
        img.setAttribute('src', objUrl);

        photoContainer.appendChild(img);

        setUpModal(`#x${id}`, `${id}`);
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
        const numInputs = ['max_rychlost', 'pocet_technikov', 'cas_install'];

        dataKeys.forEach(key => {
            if (key === 'datum_vytvorenia') {
                getDomElement(`#${key}`).innerHTML = moment(inputData[key]).format('DD.MM.YYYY') || 'error';
            } else if (key === 'stav') {
                setBackgroundColor(`.${key}`, COLOR_MAP.get(inputData[key]));
                setBackgroundColor(`#${key}`, COLOR_MAP.get(inputData[key]));
                getDomElement(`#${key}`).innerHTML = STAV_MAP.get(inputData[key]) || 'error';
            } else if (numInputs.includes(key)) {
                getDomElement(`#${key}`).value = inputData[key] != 'null' ? inputData[key] : '';
            } else {
                getDomElement(`#${key}`).innerHTML = inputData[key] != 'null' ? inputData[key] : '';//key == 'null' ? '' : inputData[key]; // inputData[key] || 'error';
            }
        });
        if (inputData.dovod_neuspech === 'null') {
            getDomElement('.dovod_neuspech').remove();
            getDomElement('#dovod_neuspech').remove();
            getDomElement('#dov_neusp').remove();
        } else if (inputData.dovod_neuspech != 'null' && inputData.dovod_neuspech.length > 0) {
            getDomElement('#dovod_neuspech').innerHTML = inputData.dovod_neuspech;
        }
        if (inputData.sluzba_internet === 'true') {
            getDomElement('#sluzba_internet').checked = true;
        }

        if (inputData.sluzba_internettv === 'true') {
            getDomElement('#sluzba_internettv').checked = true;
        }

        if (inputData.individ_rozpocet === 'true') {
            getDomElement('#individ_rozpocet').checked = true;
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

        if (domId === '#bod_final') {
            if (Object.keys(data).length === 0) {
                let empty = document.createElement('option'); 
                empty.setAttribute('value', '');
                let emptyText = document.createTextNode('');
                empty.appendChild(emptyText);
                select.appendChild(empty);    
            }
            let option = document.createElement('option');
            option.setAttribute('value', 'iny_bod');
            let optionText = document.createTextNode('Iné');
            option.appendChild(optionText);
            select.appendChild(option);
        }

        select.addEventListener('change', () => {
            if (useColors && useColors) {
                select.style.backgroundColor = COLOR_MAP.get(select.value);
            }

            if (domId === '#bod_final' && select.value == 'iny_bod') {
                utils.getDomElement('#final_bod_popup').style.display = 'block';
            }
        });

    }

    function showDeviceData(data) {
        const zariadenie = data.filter(d => d.typ === 'ZARIADENIE').sort((a,b) => a.model.localeCompare(b.model));
        const zariadenieIne = data.filter(d => d.typ === 'ZARIADENIE_INE').sort((a,b) => a.model.localeCompare(b.model));
        const material = data.filter(d => d.typ === 'MATERIAL').sort((a,b) => a.model.localeCompare(b.model));
        const materialIne = data.filter(d => d.typ === 'MATERIAL_INE').sort((a,b) => a.model.localeCompare(b.model));
        const all = [...zariadenie, ...zariadenieIne, ...material, ...materialIne];

        let deviceData = '';
        all.forEach(d => {
            deviceData += `<tr class="horizontal-divider"><td class="device-data-td" style="width:90%" data-id="${d.udoValueId}">${d.model}</td>`;
            deviceData += `<td class="right-align"><button onclick="utils.removeDevice(event)" class="device-button">-</button></td></tr>`
        });   

        getDomElement('#zar_mat').innerHTML = deviceData;
    }
    // device_table
    function addDevice() {
        const selectDevice = document.createElement('select');
        const id = new Date().getTime();
        selectDevice.setAttribute('id', `x${id}`);
        DEVICE.forEach((value, key) => {
            let option = document.createElement('option');
            option.setAttribute('value', key);
            let optionText = document.createTextNode(key);
            option.appendChild(optionText);
            selectDevice.appendChild(option);
        });

        getDomElement('.select-device').appendChild(selectDevice);

        selectDevice.addEventListener('change', () => {
            if (selectDevice.value == 'Iné') {
                getDomElement(`#x${id}`).remove();
                utils.getDomElement('#ine_device_popup').style.display = 'block';
            } else if (selectDevice.value == 'Ethernetový kábel') {
                getDomElement(`#x${id}`).remove();
                utils.getDomElement('#eternet_popup').style.display = 'block';
            } else {
                let table = getDomElement('#device_table');
                let row = table.insertRow(-1);
                row.classList.add('horizontal-divider');
                let cell = row.insertCell(0);
                cell.classList.add('device-data-td');
                cell.innerText = selectDevice.value;
                let removeCell = row.insertCell(1);
                removeCell.innerHTML = '<button onclick="utils.removeDevice(event)" class="device-button">-</button>';
                removeCell.classList.add('right-align');
                getDomElement(`#x${id}`).remove();
            }
        });
    }
    // call this in close popup
    function readPopupDeviceData(id) {
        let table = getDomElement('#device_table');
        let row = table.insertRow(-1);
        row.classList.add('horizontal-divider');
        let cell = row.insertCell(0);
        cell.classList.add('device-data-td');
        if (id == '#eternet_popup') {
            let dlzka = getDomElement('#eternet_dlzka').value;
            cell.innerText = `Ethernetový kábel: ${dlzka} m`;
            cell.setAttribute('id', 'ETERNET')
            // cell.setAttribute('id', 'ETERNET')
            getDomElement('#eternet_dlzka').value = '';
        } else if (id == '#ine_device_popup') {
            //ine_device_type
            cell.innerText = getDomElement('#ine_device_text').value;
            cell.setAttribute('id', getDomElement('#ine_device_type').value);
            getDomElement('#ine_device_text').value = '';
        }
        let removeCell = row.insertCell(1);
        removeCell.innerHTML = '<button onclick="utils.removeDevice(event)" class="device-button">-</button>';
        removeCell.classList.add('right-align');
    }

    function readNewBodPopupData(id) {
        let newBod = getDomElement('#new_final_bod').value;
        let select = getDomElement('#bod_final');
        let option = document.createElement('option');
        option.setAttribute('value', newBod);
        let optionText = document.createTextNode(newBod);
        option.appendChild(optionText);
        select.appendChild(option);
        select.value = newBod;
    }

    function removeDevice(event) {
        let selectedRow = event.currentTarget.parentElement.parentElement;
        selectedRow.remove();
    }

    function getEditableFieldsValues() {
        let returnData = {};
        EDITABLE_FIELDS.forEach(field => {
            let fieldTag = getDomElement(`#${field}`);
            if (field === 'sluzba_internet' || field === 'sluzba_internettv' || field === 'individ_rozpocet') {
                returnData[field] = fieldTag.checked ? 'true' : 'false';
            } else {
                returnData[field] = fieldTag.value;
            }
        });

        return returnData;
    }

    function getDevicesFromUi(data) {
        // get udoValueId array for comparing 
        const udoId = data.map(d => d.udoValueId);
        const tempDelete = [];
        //device-data-td
        let deviceDataCells = getDomElements('.device-data-td');
        let deviceData = [];
        deviceDataCells.forEach(cellData => {
            let dataId = cellData.getAttribute('data-id');
            if (udoId.includes(dataId)) {
                tempDelete.push(dataId);
            } else {
                if (cellData.id == 'ETERNET') {
                    deviceData.push({ typ: 'MATERIAL', model: cellData.innerHTML, ine: '' })
                } else if (cellData.id == 'MATERIAL' || cellData.id == 'ZARIADENIE') {
                    deviceData.push({ typ: `${cellData.id}_INE`, model: cellData.innerHTML, ine: '' });
                } else {
                    deviceData.push({ typ: DEVICE.get(cellData.innerHTML), model: cellData.innerHTML, ine: '' });
                }
            }
        });

        // check if there is data to delete
        let toDelete = udoId.filter(d => !tempDelete.includes(d));

        return { patch: deviceData, delete: toDelete };
    }

    function disableEdit() {
        [...document.getElementsByTagName('button')].forEach(b => {
            if (b.id != 'stav') {
                b.disabled = true;
            }
        });
        [...document.getElementsByTagName('select')].forEach(s => s.disabled = true);
        [...document.getElementsByTagName('textarea')].forEach(t => t.disabled = true);
        [...document.getElementsByTagName('input')].forEach(i => i.disabled = true);
    }

    /**
     * 
     * @param {string} message 
     */
    function showSavePopup(message) {
        getDomElement('#save_popup').style.display = 'block';
        getDomElement('#save_popup_text').innerHTML = message;
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
        getEditableFieldsValues,
        showDropdown,
        closePopup,
        selectStav,
        getUiStavValue,
        addDevice,
        removeDevice,
        getDevicesFromUi,
        cancelPopup,
        disableEdit,
        goForward,
        goBackward,
        deletePhoto,
        showSavePopup
    }
})();