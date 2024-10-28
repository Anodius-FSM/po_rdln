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
        const servicallType = await common.fetchServiceCallType('7A5FBAE82151416CA5B87201A7F8EBAC');
        console.log("🚀 ~ startExtension ~ servicallType:", servicallType)
    }

    return {
        testMyExtension,
        startExtension
    }



}) ();