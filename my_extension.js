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
        // 2C2CA7F13B8647EBA74AF129B0E67043

        const resp = await common.fetchPeriods('2C2CA7F13B8647EBA74AF129B0E67043');
        console.log("🚀 ~ testMyExtension ~ resp:", resp)
        

        // utils.setFieldValue('#info', `User: ${context.user} :: ${context.account} :: ${context.company}`);
    }

    async function startExtension() {

        console.log("🚀 ~ startExtension ~ startExtension:")
        try {
            const serviceCallType = await common.fetchServiceCallType('7A5FBAE82151416CA5B87201A7F8EBAC');
            if (serviceCallType !== '-7') {
                utils.setFieldValue('#info', 'Toto SV nie je typu Obhliadka a teda neobsahuje žiadne dáta na zobrazenie.');
            } else {
                // run the extension
            }
        } catch (error) {
            console.log("🚀 ~ startExtension ~ error:", error)
            utils.setFieldValue('#error', error);
        }
    }

    return {
        testMyExtension,
        startExtension
    }



})();