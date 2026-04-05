const TABLER_ICONS_NOTICE = `/*!
 * tabler-icons (included via react-icons/tb)
 * MIT License - Copyright (c) 2020-present Paweł Kuna
 * https://github.com/tabler/tabler-icons/blob/master/LICENSE
 */`;

const IONICONS_NOTICE = `/*!
 * ionicons (included via react-icons/io)
 * MIT License - Copyright (c) 2015-present Ionic
 * https://github.com/ionic-team/ionicons/blob/main/LICENSE
 */`;

const BOOTSTRAP_ICONS_NOTICE = `/*!
 * Bootstrap Icons (included via react-icons/bs)
 * MIT License - Copyright (c) 2019-2024 The Bootstrap Authors
 * https://github.com/twbs/icons/blob/main/LICENSE
 */`;

const EXTRA_LICENSE_ENTRIES = [
    { match: r => r.includes('react-icons/tb'), notice: TABLER_ICONS_NOTICE    },
    { match: r => r.includes('react-icons/io'), notice: IONICONS_NOTICE        },
    { match: r => r.includes('react-icons/bs'), notice: BOOTSTRAP_ICONS_NOTICE },
];

module.exports = { EXTRA_LICENSE_ENTRIES };