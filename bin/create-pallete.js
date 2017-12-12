const inquirer = require('inquirer');

module.exports = {
    run: (args, options, logger, generateGumgaLayout) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'darkPrimary',
                default: '#00796B',
                message: 'Dark Primary..: '
            },
            {
                type: 'input',
                name: 'primary',
                default: '#009688',
                message: 'Primary..: '
            },
            {
                type: 'input',
                name: 'lightPrimary',
                default: '#B2DFDB',
                message: 'Light Primary..: '
            },
            {
                type: 'input',
                name: 'textIcons',
                default: '#FFFFFF',
                message: 'Text Icons..: '
            },
            {
                type: 'input',
                name: 'accent',
                default: '#607D8B',
                message: 'Accent..: '
            },
            {
                type: 'input',
                name: 'primaryText',
                default: '#212121',
                message: 'Primary Text..: '
            },
            {
                type: 'input',
                name: 'secundaryText',
                default: '#757575',
                message: 'Secundary Text..: '
            },
            {
                type: 'input',
                name: 'divider',
                default: '#EAEAEA',
                message: 'Divider..: '
            },
            {
                type: 'input',
                name: 'background',
                default: '#ECEFF1',
                message: 'Background..: '
            }
        ]).then(resp => {
            generateGumgaLayout(resp.darkPrimary, resp.primary, resp.lightPrimary, resp.textIcons, resp.accent, resp.primaryText, resp.secundaryText, resp.divider, resp.background, args.themeName);
        })
    }
};