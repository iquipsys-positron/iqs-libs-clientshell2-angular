
{
    function declareGlobalHelpContentesources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            GLOBAL_HELP_SECTION_01: 'Monitoring',
            GLOBAL_HELP_TEXT_01: "After successfully logging into the system, the first thing you will see is the screen with the map in the middle, " +
                "the Tools Panel on the left side, and the Incident Panel on the right side. " +
                "Looking at the Tools Panel, we see 7 tools, and one of them, Monitoring, is currently active.\n\n" +
                "In Monitoring, we see the map of the work organization, objects and zones on the map. In the corners are additional instruments: " +
                "a search box, object panel, fab tool, and zoom buttons. \n\nUsing these buttons we can zoom in and out of the map.\n\n" +
                "Map controls here are the same as in other online map applications, and gestures are supported on touch screen devices.\n\n" +
                "You can have several locations defined on your map and quickly move between them using the Locations tool. " +
                "Click \'Locations\' in the Fab tool, and select a location and see the map move to it.",

            GLOBAL_HELP_SECTION_02: 'Objects',
            GLOBAL_HELP_TEXT_02: "" +
                "Currently on the map we see three types of objects: people, vehicles and assets. When zoomed out, we see them as small triangles, " +
                "squares, and circles. When we zoom in, these icons become more informative. Their icons become more distinct and below each " +
                "icon we now see the objects’ names and descriptions.\n\n We can select an object by clicking on its icon." +
                "The object becomes highlighted and there appears a \'trace\' of dots behind it. " +
                "The trace shows where the object has been in the near past. The trace follows the object as it move.\n\n" +
                "To avoid highlighted objects from moving out of our view, we can use the system’s Autofocus mode. " +
                "If you click the selected object once more, the object’s icon will change again and the map will center on the object " +
                "and move automatically as the object moves. This can come in handy when you need to monitor an object over a long period of time. " +
                "To cancel autofocus, simple click on outside of the object ",


            GLOBAL_HELP_SECTION_03: 'Object Tool',
            GLOBAL_HELP_TEXT_03: "Lets use the Object Tool located at the lower left of the screen to have a closer look at our objects. \n\n" +
                "Here we see how many people, vehicles and assets we’re currently tracking. The red numbers below tell us how many objects need " +
                "to be there, (by the shift roster, we\'ll talk about it later) but there\'s no current data from them on the server. Zeros means all good.\n\n" +
                "If we click on the human icon, we will see all the people there. For every person, we can see the Category, Type, Groups " +
                "it belongs to, hours online (or offline), which tracking device is associated with him or her. \n\n" +
                "We can also see the person’s position on the map right from this tool, and this is real-time picture, it will move with object movements. " +
                "We can switch to a different person and see their movements from here.\n\n" +
                "We can go back to Monitoring tool by clicking the link in the Tools Panel.\n\n" +
                "If we now click on the vehicle icon in the Object Tool, we will again go to the list, but now there will be only vehicles." +
                "Each of them also has a Category and Type, and we can see which groups they belong to. We can also monitor their movements from here, " +
                "and monitor different equipment from the same place.\n\n" +
                "Here we can see Events and Incidents involving our vehicles. We will talk about Events and Incidents in a separate topic later.\n\n" +
                "And finally, we can we current status of this object: it’s coordinates, speed, direction, and so on.\n\n",

            GLOBAL_HELP_SECTION_04: 'Event rules and zones',
            GLOBAL_HELP_TEXT_04: ' ',

            GLOBAL_HELP_STATE_MONITORING: 'Monitoring',
            GLOBAL_HELP_STATE_MONITORING_OBJECT: 'Monitoring objects',
            GLOBAL_HELP_STATE_DEFAULT_NAME: 'Open',
            GLOBAL_HELP_EVENT_RULE: 'Event rules and zones',

            GLOBAL_HELP_SUPPORT_MAIL: 'Please send all your inquires to ',
            GLOBAL_HELP_SUPPORT_PORTAL_PRE: 'You can aslo use our ',
            GLOBAL_HELP_SUPPORT_PORTAL_LINK: 'support portal',
            GLOBAL_HELP_SUPPORT_PORTAL_POST: ' to ask questions. We\'ll be glad to help you.',

        });
        pipTranslateProvider.translations('ru', {
            GLOBAL_HELP_SECTION_01: 'Наблюдение',
            GLOBAL_HELP_TEXT_01: 'При входе в систему, после того как мы ввели свой логин и пароль, мы видим первый экран: ' +
                'карту предприятия с объектами на ней, панель инструментов слева и панель происшествий cправа.\n\n' +
                'На панели инструментов системы мы видим 7 разделов, "Наблюдение" активный по умолчанию. \n\n' +
                'Главным элементом этого экрана служит карта. она занимает центральное место, на ней м мы видим точки объектов и ' +
                'геозоны разной конфигурации. В углах карты расположены вспомогательные инструменты. \n\n',
            // '## Ссылки \n\n',
            // '- [Наблюдение](http://positron.iquipsys.net/#/monitoring/map)',
            // '- [Наблюдение](http://tracker.pipdevs.com/#/monitoring/map)',
            GLOBAL_HELP_SECTION_02: 'Объекты на карте',
            GLOBAL_HELP_TEXT_02: 'На карте отображаются 3 типа объектов: машины, люди и механизмы. ' +
                'Они отображаются квадратами, треугольниками и кружочками, а при уменьшении массштаба, в виде иконок машин, людей и механизмов. \n\n' +
                'Клик на иконке объекта, позволяет выделить его. Для выделенного объекта отображается путь его движения в виде узловых точек, соединенных ломаной линией.' +
                'Клик на уже выделенном объекте, переводит его в состояние автоматического слежения. Выделенный объект всегда будет отображатся посредине карты. \n\n' +
                'Для отмены режима слежения, можно выбрать другой объект, или просто кликнуть мышкой в любой свободной точке карты.',

            GLOBAL_HELP_SECTION_03: 'Панель Объектов',
            GLOBAL_HELP_TEXT_03: 'Панель объектов находится в левом нижнем углу карты. Верхний ряд цифр на панели показывает количество людей, машин и механизмов, которые отслеживаются в текущий момент.' +
                'Красные цифры в нижнем ряду, обозначают количество объектов, которые должны быть на карте (по расписанию), но их по каким-то причинам сейчас нет. \n\n' +
                'Посмотреть список нужных нам объектов и их свойства можно кликнув на соответствующую юконку (человека, машины или механизма) на панели объектов. \n\n' +
                'Для каждого объекта, мы можем посмотреть его свойства, текуще местоположение на карте, координаты и статус.\n\n\n\n',

            GLOBAL_HELP_SECTION_04: 'Правила для событий и зоны',
            GLOBAL_HELP_TEXT_04: ' ',

            GLOBAL_HELP_STATE_MONITORING: 'Наблюдение',
            GLOBAL_HELP_STATE_MONITORING_OBJECT: 'Наблюдение, объекты',
            GLOBAL_HELP_STATE_DEFAULT_NAME: 'Открыть',
            GLOBAL_HELP_EVENT_RULE: 'Правила для событий и зоны',

            GLOBAL_HELP_SUPPORT_MAIL: 'По всем вопросам обращайтесь на ',
            GLOBAL_HELP_SUPPORT_PORTAL_PRE: 'Вы также можете зайти на наш ',
            GLOBAL_HELP_SUPPORT_PORTAL_LINK: 'портал поддержки',
            GLOBAL_HELP_SUPPORT_PORTAL_POST: ' и задать ваш вопрос там. Мы будем рады Вам помочь!'
        });
    }

    angular
        .module('iqsGlobalHelp')
        .config(declareGlobalHelpContentesources);
}
