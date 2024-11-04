(() => {

    async function bootstrap() {
        const { ShellSdk } = FSMShell;

        if (ShellSdk.isInsideShell()) {
            common.setShellSdk(ShellSdk.init(parent, '*'));
        } else {
            utils.setFieldValue('#error', 'Unable to reach shell event API');
            throw new Error('Unable to reach shell event API');
        }
    }

    bootstrap();
   // my_extension.testMyExtension();
    my_extension.startExtension();
    console.log(document.querySelectorAll('.thumbnail'));
   // utils.setUpModal(['#myImg1', '#myImg2', '#myImg3', '#myImg4' ]);

})();