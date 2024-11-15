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

    const STAV_MAP = new Map([
        ['NEZRIADITELNA', 'Nezriaditeľná'],
        ['ZAPARKOVANE', 'Zaparkované'],
        ['ZMENA_SLUZBY', 'Zriad. so zmenou služby'],
        ['KONTROLA', 'Kontrola'],
        ['PREBIEHA', 'Prebieha'],
        ['ZRIADITELNA', 'Zriaditeľná']
    ]);

    // const DEVICE_TYP = new Map([
    //     ['KONZOLA_SAT', 'SAT konzola'],
    //     ['KONZOLA', 'Konzola/ Držiak'],
    //     ['ZARIADENIE', 'Zariadenie'],
    //     ['DRZIAK_BALKON', 'Držiak na satelit na balkón (vodorovná tyč)'],
    //     ['MATERIAL', 'Materiál'],
    //     ['DRZIAK_STA', 'Držiak na STA (zvislá tyč)']
    // ]);
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

    // const DEVICE_UDO_NAMES = new Map([

    // ])

    const EDITABLE_FIELDS = ['sluzba_internet', 'sluzba_internettv', 'bod_final', 'install_technik',
        'uspesna', 'narocnost', 'poznamka_kontrolora', 'rebrik'];
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
    //TODO: rozsirit o stuff pre device table ine_device_button
    function closePopup(id) {
        getDomElement(id).style.display = 'none';
        readPopupDeviceData(id);
    }

    function cancelPopup(id) {
        getDomElement(id).style.display = 'none';
    }

    function getMapKeys(map, val) {
        return [...map].find(([key, value]) => val === value)[0];
    }

    //TODO dropdown stuff start
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

    }


    //TODO dropdown stuff end


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
                setBackgroundColor(`#${key}`, COLOR_MAP.get(inputData[key]));
                getDomElement(`#${key}`).innerHTML = STAV_MAP.get(inputData[key]) || 'error';
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
            deviceData += `<tr class="horizontal-divider"><td class="device-data-td" style="width:90%"`;//<td class="device-typ">${DEVICE_TYP.get(d.typ)}<td>`;
            if (d.model !== 'null' && d.ine !== 'null') {
                deviceData += `>${d.model} / ${d.ine}</td>`; //  class="center-align"
            } else if (d.model !== 'null' && d.ine === 'null') {
                deviceData += d.model.includes('Ethernet') ? `id="ETERNET">${d.model}</td>` : `>${d.model}</td>`;
            } else if (d.model === 'null' && d.ine !== 'null') {
                deviceData += `id="${d.typ}">${d.ine}</td>`;
            }
            deviceData += `<td class="right-align"><button onclick="utils.removeDevice(event)" class="device-button">-</button></td></tr>`
        });
        // deviceData += `<tr><td></td><td class="right-align"><button class="device-button">+</button></td></tr>`

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
            } else if(selectDevice.value == 'Ethernetový kábel') {
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

    function removeDevice(event) {
        let selectedRow = event.currentTarget.parentElement.parentElement;
        selectedRow.remove();
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

    function getDevicesFromUi() {
        //device-data-td
        let deviceDataCells = getDomElements('.device-data-td');
        console.log('deviceDataCells: ', deviceDataCells);
        let deviceData = [];
        deviceDataCells.forEach(cellData => {
            if (cellData.id == 'ETERNET') {
                deviceData.push({ typ: 'MATERIAL' , model: cellData.innerHTML, ine: '' })
            } else if (cellData.id == 'MATERIAL' || cellData.id == 'ZARIADENIE') {
                deviceData.push({ typ: cellData.id, model:'', ine: cellData.innerHTML });
            } else {
                deviceData.push({ typ: DEVICE.get(cellData.innerHTML), model: cellData.innerHTML, ine: '' });
            }
        });

        return deviceData;
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
        cancelPopup
    }
})();