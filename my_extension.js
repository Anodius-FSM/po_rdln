/**
 * Rename this file accordong to your needs..
 * this file should contain the main logic of the extension
 * 
 * 
 * 
 * 
 */

const my_extension = (() => {

    async function testMyExtension() {
        const context = await common.getContext();
        console.log("🚀 ~ testMyExtension ~ context:", context)

       // utils.setFieldValue('#info', `User: ${context.user} :: ${context.account} :: ${context.company}`);
    }

    async function startExtension() {
        
        console.log("🚀 ~ startExtension ~ startExtension:")
        try {
            const servicallType = await common.fetchServiceCallType('7A5FBAE82151416CA5B87201A7F8EBAC');
        } catch (error) {
            console.log("🚀 ~ startExtension ~ error:", error)
            utils.setFieldValue('#error', 'Nastala sa nejaka chyba, kontaktujte admina.');
        }
        console.log("🚀 ~ startExtension ~ servicallType:", servicallType)

        if (servicallType !== '-7') {
            utils.setFieldValue('#info', 'Toto SV nie je typu Obhliadka a teda neobsahuje žiadne dáta na zobrazenie.');
        } else {
            // run the extension
        }
    }

    return {
        testMyExtension,
        startExtension
    }



}) ();