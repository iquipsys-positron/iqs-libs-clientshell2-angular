(() => {
    const translateConfig = function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            SITES_QUICK_START_TITLE: 'Quick start',
            QUICK_START_LOADING_TITLE: 'Loading organization information',
            SITES_CREATE_INVITE_PEOPLE1: "You can invite more people after the organization has been created, using the system's configuration tool. There you will be able to change their access levels as well (user, manager or administrator).",
            ACCOUNT_PHONE_VALIDATE_ERROR: 'Enter a valid phone in e.164 format: +xxxxxxxxxxx',
            ACCOUNT_PHONE_UDI_UNIQUE: 'The entered phone number is already in use',
            ACCOUNT_SERVER_UDI_UNIQUE_ERROR: 'The entered UDI is already in use',
            ACCOUNTT_EMAIL_VALIDATE_ERROR: 'Enter a valid email',
            ACCOUNTT_EMAIL_UNIQUE_ERROR: 'E-mail address already in use',
            SITES_MOBILE_WELCOME_TITLE: 'Workorganization ',
            SITES_MOBILE_WELCOME_TITLE1: ' object registration.',
            SITES_MOBILE_WELCOME_DESCRIPTION: 'Congratulations! Your workorganization has been created! In order to see an object on the map, we first need to register its tracker in the system, secondly - create the object itself, and finally - link the registered tracker with the created object. Here we can guide you through this process, step-by-step.',
            SITES_MOBILE_WELCOME_DESCRIPTION1: "On the other hand, you can skip all further steps and return to them later on, via the system's Configuration section.",
            SITES_CREATE_INVITE_PEOPLE_PLACEHOLDER: 'User name or e-mail address',
            SITES_MOBILE_WELCOME_SKIP_BUTTON: 'Continue',
            SITES_MOBILE_WELCOME_PROCESS_BUTTON: 'Add an Object',
            SITES_QUICK_START_SKIP_BUTTON: 'Continue',
            SITES_QUICK_START_ADD_MOBILE_TITLE: 'Adding an Object to monitor',
            SITES_QUICK_START_MOBILE_CREATE_BUTTON: 'Create',
            SITES_QUICK_START_MOBILE_SKIP_BUTTON: 'Continue',
            SITES_CREATE_MOBILE_START_BUTTON_SKIP: 'Continue',
            SITES_CREATE_MOBILE_START_BUTTON_PHONE: 'Use smartphone',
            SITES_CREATE_MOBILE_MORE_BUTTON_NEXT: 'Next',
            SITES_CREATE_MOBILE_MORE_BUTTON_ADD_MORE: 'Add more',
            SITES_CREATE_LORA_BUTTON: 'NEXT',
            SITE_CREATE_OBJECT_NAME_UNIQUE_ERROR: 'Object with this name already exists',

            SITES_CREATE_MOBILE_WELCOME_TITLE: 'Tracker and Object registration',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE1: 'To start monitoring your objects on the map, you need to:',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE2: 'Register your tracker devices in the system.',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE3: 'Create the objects themselves: people, vehicles, equipment.',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE4: 'Link tracker devices to the created objects.',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE5: "All of this can be done later in the system's Configurations section. However, we can help guide you through the process step-by-step to make your first time easier.",
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE6: 'First off - does your workorganization have mobile network coverage and can you use your smartphone for internet access?',

            SITES_CREATE_MOBILE_WELCOME_NOT_BUTTON: "No, I can't",
            SITES_CREATE_MOBILE_WELCOME_YES_BUTTON: 'Yes, I can',
            SITES_CREATE_MOBILE_START_TITLE: 'Connecting smartphone',
            SITES_CREATE_MOBILE_START_SUBTITLE1: "Excellent! Let's turn your smartphone into a Positron tracker device.",
            SITES_CREATE_MOBILE_START_SUBTITLE2: 'To do this you will need to install iQsTracker - our free mobile app - from the Android Market (only Android phones are supported at this time).',
            SITES_CREATE_MOBILE_START_SUBTITLE3: '	Once the app is installed, you can link your phone to your workorganization by entering the following Organization code: ',
            SITES_CREATE_MOBILE_START_SUBTITLE4: "You will be able view and change it later in the organization's Configuration section (in Organization profile -> Organization settings).",
            SITES_CREATE_MOBILE_START_SUBTITLE5: 'We can automatically register your smartphone on your workorganization, as well as send you a link to the mobile app via SMS. For this, please enter your telephone number.',
            SITES_CREATE_MOBILE_MORE_TITLE: 'Please check your phone for our SMS',
            SITES_CREATE_MOBILE_MORE_SUBTITLE1: 'We sent you an SMS with the link to the iQsTracker app, as well as the organization code, for your convenience. Once you install the application and connect your smartphone to your workorganization (code ',
            SITES_CREATE_MOBILE_MORE_SUBTITLE2: '), the server will start receiving position data from your smartphone and the object linked in the system to your phone will appear on the map.',
            SITES_CREATE_LORA_TITLE: 'LoRaWAN communication network',
            SITES_CREATE_LORA_SUBTITLE1: 'If your workorganization lacks mobile network coverage or it is unusable for some other reason, then we recommend using a simple and reliable communication technology, used by IoT devices. You will need a LoRaWAN gateway and special trackers for your people and equipment. This unique technology can cover up to 15 km in radius with just one gateway, while providing low power communication and extending the battery life of devices that use it. Depending on how often you decide to transmit, our LoRaWAN trackers can last from 20 hours to several weeks on one charge.',
            SITES_CREATE_LORA_SUBTITLE2: ' All you need to do is to  <a href="http://www.iquipsys.com/docs/eng/IQuipsys_proposal.pdf" target="_blank">buy</a> the LoRaWAN Gateway and some trackers, connect the gateway to the Internet and register trackers in Positron.',
            SITES_CREATE_LORA_SUBTITLE3: " Once you are ready, just follow the instructions in our Help system or contact us and we will get you started.",
        });


        pipTranslateProvider.translations('ru', {
            SITES_QUICK_START_TITLE: 'Быстрый старт',
            QUICK_START_LOADING_TITLE: 'Загружается информация о площадке',
            SITES_CREATE_INVITE_PEOPLE1: 'Вы можете пригласить больше людей используя настройки системы, после того как будет создана площадка. Также Вы сможете изменить роль для приглашенных людей (пользователь, менеджер и администратор площадки).',
            ACCOUNT_PHONE_VALIDATE_ERROR: 'Используйте E.164 формат для телефонных номеров: +xxxxxxxxxxx',
            ACCOUNT_PHONE_UDI_UNIQUE: 'Введенный номер телефона уже используется',
            ACCOUNT_SERVER_UDI_UNIQUE_ERROR: 'Введенный UDI уже используется',
            ACCOUNTT_EMAIL_VALIDATE_ERROR: 'Введите адрес электронной почты',
            ACCOUNTT_EMAIL_UNIQUE_ERROR: 'Адрес электронной почты уже используется',
            SITES_MOBILE_WELCOME_TITLE: 'Регистрация объектов на рабочей площадке ',
            SITES_MOBILE_WELCOME_TITLE1: '.',
            SITES_MOBILE_WELCOME_DESCRIPTION: 'Поздравляем – Ваша рабочая площадка создана! Для наблюдения за объектами, нужно сначала зарегистрировать на ней мобильные устройства-трекеры, затем создать сами объекты: людей и машины, а затем привязать трекеры к этим объектам. Мы можем помочь вам все это сделать сейчас, шаг за шагом.',
            SITES_MOBILE_WELCOME_DESCRIPTION1: 'С другой стороны, все последующие шаги можно пропустить и вернуться к ним позже в настройках системы.',
            SITES_CREATE_INVITE_PEOPLE_PLACEHOLDER: 'Имя пользователя или адрес электронной почты',
            SITES_MOBILE_WELCOME_SKIP_BUTTON: 'Пропустить',
            SITES_MOBILE_WELCOME_PROCESS_BUTTON: 'Добавить объект',
            SITES_QUICK_START_SKIP_BUTTON: 'Пропустить',
            SITES_QUICK_START_ADD_MOBILE_TITLE: 'Добавление объекта наблюдения',
            SITES_QUICK_START_MOBILE_CREATE_BUTTON: 'Создать',
            SITES_QUICK_START_MOBILE_SKIP_BUTTON: 'Пропустить',
            SITES_CREATE_MOBILE_START_BUTTON_SKIP: 'Пропустить',
            SITES_CREATE_MOBILE_START_BUTTON_PHONE: 'Использовать смартфон',
            SITES_CREATE_MOBILE_MORE_BUTTON_NEXT: 'Продолжить',
            SITES_CREATE_MOBILE_MORE_BUTTON_ADD_MORE: 'Ввести еще номер',
            SITES_CREATE_LORA_BUTTON: 'Продолжить',
            SITE_CREATE_OBJECT_NAME_UNIQUE_ERROR: 'Объект с таким именем уже существует',

            SITES_CREATE_MOBILE_WELCOME_TITLE: 'Регистрация трекеров и объектов наблюдения',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE1: 'Для наблюдения за объектами на карте, нужно:',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE2: 'Зарегистрировать мобильные устройства - трекеры.',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE3: 'Создать в системе сами объекты: людей, машины и механизмы.',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE4: 'Привязать трекеры к созданным объектам.',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE5: 'Все это можно сделать позже, в Настройках системы. Однако, для облегчения Вашей задачи в первый раз, мы можем помочь вам все это сделать сейчас, шаг за шагом.',
            SITES_CREATE_MOBILE_WELCOME_SUBTITLE6: 'Для начала: Есть ли на Вашей площадке мобильный интернет и можете ли Вы подключится к нему со своего смартфона?',

            SITES_CREATE_MOBILE_WELCOME_NOT_BUTTON: 'Нет, не могу',
            SITES_CREATE_MOBILE_WELCOME_YES_BUTTON: 'Да, могу',
            SITES_CREATE_MOBILE_START_TITLE: 'Подключаем смартфон',
            SITES_CREATE_MOBILE_START_SUBTITLE1: 'Отлично! Давайте начнем с того что превратим ваш смартфон в трекер Позитрона.',
            SITES_CREATE_MOBILE_START_SUBTITLE2: 'Для этого вам понадобиться загрузить наше бесплатное мобильное приложение iQsTracker (пока поддерживаются только смартфоны на Андроиде).',
            SITES_CREATE_MOBILE_START_SUBTITLE3: 'После того, как приложение установиться, вам нужно будет подключить его к вашей Площадке, введя следующий код: ',
            SITES_CREATE_MOBILE_START_SUBTITLE4: '(код можно потом посмотреть и поменять в Настройках -> Рабочая Площадка -> Реквизиты Организации)',
            SITES_CREATE_MOBILE_START_SUBTITLE5: 'Мы можем автоматически зарегистрировать Ваш смартфон как трекер на вашей Площадке, а также послать вам СМС с ссылкой для установки мобильного приложения, если вы введете номер своего телефона.',
            SITES_CREATE_MOBILE_MORE_TITLE: 'Проверьте Ваши СМС',
            SITES_CREATE_MOBILE_MORE_SUBTITLE1: 'Мы отправили Вам СМС с ссылкой на мобильное приложение и кодом площадки. После установки на смартфон мобильного приложения и подключения его к Вашей Площадке (код ',
            SITES_CREATE_MOBILE_MORE_SUBTITLE2: '), данные от него будут приходить на сервер и привязанный к нему объект появится на карте.',
            SITES_CREATE_LORA_TITLE: 'Сеть передачи данных LoRaWAN',
            SITES_CREATE_LORA_SUBTITLE1: 'Если у вас на площадке нет мобильного интернета, или вы не можете использовать его по каким-то ' +
                'причинам, мы предлагаем вам простой и надежный способ передачи данных – станция связи (роутер)  ' +
                'LoRaWAN и специальные приборы-трекеры. Использование таких трекеров позволит Вам  ' +
                'позиционировать людей и машины на территории радиусом до 15 километров, при этом ресурса  ' +
                'батареи хватает от 20 часов до нескольких недель, в зависимости от частоты передачи данных.',
            SITES_CREATE_LORA_SUBTITLE2: 'Все что вам нужно сделать, это <a href="http://www.iquipsys.com/docs/rus/TKP_IQuipsys.pdf" target="_blank">купить</a> LoRaWAN роутер и несколько трекеров, подключить роутер к интернету и зарегистрировать все устройства в Позитроне.',
            SITES_CREATE_LORA_SUBTITLE3: 'Когда вы будете готовы, найдите соответствующий раздел в панели Помощь и следуйте простым инструкциям. В случае затруднений, обращайтесь к нам по адресу – мы вам с удовольствием поможем.',


        });
    }

    angular
        .module('iqsOrganizationQuickStart')
        .config(translateConfig);

})();

