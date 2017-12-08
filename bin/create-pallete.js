const inquirer = require('inquirer');

module.exports = {
    run: (args, options, logger, generateGumgaLayout) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'darkPrimary',
                message: 'Dark Primary..: '
            },
            {
                type: 'input',
                name: 'primary',
                message: 'Primary..: '
            },
            {
                type: 'input',
                name: 'lightPrimary',
                message: 'Light Primary..: '
            },
            {
                type: 'input',
                name: 'textIcons',
                message: 'Text Icons..: '
            },
            {
                type: 'input',
                name: 'accent',
                message: 'Accent..: '
            },
            {
                type: 'input',
                name: 'primaryText',
                message: 'Primary Text..: '
            },
            {
                type: 'input',
                name: 'secundaryText',
                message: 'Secundary Text..: '
            },
            {
                type: 'input',
                name: 'divider',
                message: 'Divider..: '
            },
            {
                type: 'input',
                name: 'background',
                message: 'Background..: '
            }
        ]).then(resp => {
            generateGumgaLayout(resp.darkPrimary, resp.primary, resp.lightPrimary, resp.textIcons, resp.accent, resp.primaryText, resp.secundaryText, resp.divider, resp.background, args.themeName);
        })
    }
};