module.exports = {
    module: {
        name: 'iqsShell',
        styles: 'index',
        export: 'iqs.shell',
        standalone: 'iqs.shell'
    },
    browserify: {
        entries: [
            // './temp/iqs-client-shell-html.min.js',
            './src/index.ts',
        ]
    },
    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: true,
        sass: true,
        lib: true,
        images: true,
        dist: false
    },
    file: {
        lib: [
            '../node_modules/pip-admin-system/dist/**/*',
            '../node_modules/pip-webui-all/dist/**/*',
            '../node_modules/pip-suite-all/dist/**/*'
        ]
    },
    samples: {
        port: 8180,
        https: false
    },
    api: {
        port: 8181
    }
};
