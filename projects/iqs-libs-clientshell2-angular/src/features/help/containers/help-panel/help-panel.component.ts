// tslint:disable:max-line-length
import { Component, OnDestroy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { helpPanelTranslations } from './help-panel.strings';
import { HelpTopic, HelpArticle, HelpPanelState } from '../../models/index';
import { IqsHelpPanelService } from '../../services/help-panel.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'iqs-help-panel',
    templateUrl: './help-panel.component.html',
    styleUrls: ['./help-panel.component.scss']
})
export class IqsHelpPanelComponent implements OnDestroy {

    private subs = new Subscription();

    public topics: HelpTopic[] = [
        {
            title: {
                ru: 'Наблюдение',
                en: 'Monitoring'
            },
            articles: [
                {
                    title: {
                        ru: 'Общие сведения',
                        en: 'Common information'
                    },
                    content: {
                        ru: `<iframe width="278" height="156" frameborder="0" allowfullscreen src="https://www.youtube.com/embed/Uu1WW0v8LGo?rel=0" style="margin: 0 auto;"></iframe>
                        <p>При входе в систему, после того как мы ввели свой логин и пароль, мы видим первый экран: карту предприятия с объектами на ней, панель инструментов слева и панель происшествий cправа.</p>
                        <p>На панели инструментов системы мы видим 7 разделов, "Наблюдение" активный по умолчанию.</p>
                        <p>Главным элементом этого экрана служит карта. она занимает центральное место, на ней м мы видим точки объектов и геозоны разной конфигурации. В углах карты расположены вспомогательные инструменты.</p>
                        `,
                        en: `<iframe width="278" height="156" frameborder="0" allowfullscreen src="https://www.youtube.com/embed/hSVQOt2ooRk?rel=0" style="margin: 0 auto;"></iframe>
                        <p>After successfully logging into the system, the first thing you will see is the screen with the map in the middle, the Tools Panel on the left side, and the Incident Panel on the right side. Looking at the Tools Panel, we see 7 tools, and one of them, Monitoring, is currently active.</p>
                        <p>In Monitoring, we see the map of the work organization, objects and zones on the map. In the corners are additional instruments: a search box, object panel, fab tool, and zoom buttons.</p>
                        <p>Using these buttons we can zoom in and out of the map.</p>
                        <p>Map controls here are the same as in other online map applications, and gestures are supported on touch screen devices.</p>
                        <p>You can have several locations defined on your map and quickly move between them using the Locations tool. Click 'Locations' in the Fab tool, and select a location and see the map move to it.</p>
                        `
                    }
                }
            ]
        },
        {
            title: {
                ru: 'Объекты на карте',
                en: 'Objects'
            },
            articles: [
                {
                    title: {
                        ru: 'Общие сведения',
                        en: 'Common information'
                    },
                    content: {
                        ru: `<iframe width="278" height="156" frameborder="0" allowfullscreen src="https://www.youtube.com/embed/AYnGtY-mlgI?rel=0" style="margin: 0 auto;"></iframe>
                        <p>На карте отображаются 3 типа объектов: машины, люди и механизмы. Они отображаются квадратами, треугольниками и кружочками, а при уменьшении массштаба, в виде иконок машин, людей и механизмов.</p>
                        <p>Клик на иконке объекта, позволяет выделить его. Для выделенного объекта отображается путь его движения в виде узловых точек, соединенных ломаной линией. Клик на уже выделенном объекте, переводит его в состояние автоматического слежения. Выделенный объект всегда будет отображатся посредине карты.</p>
                        <p>Для отмены режима слежения, можно выбрать другой объект, или просто кликнуть мышкой в любой свободной точке карты.</p>
                        `,
                        en: `<iframe width="278" height="156" frameborder="0" allowfullscreen src="https://www.youtube.com/embed/IFgHpNiYD9Y?rel=0" style="margin: 0 auto;"></iframe>
                        <p>Currently on the map we see three types of objects: people, vehicles and assets. When zoomed out, we see them as small triangles, squares, and circles. When we zoom in, these icons become more informative. Their icons become more distinct and below each icon we now see the objects’ names and descriptions.</p>
                        <p>We can select an object by clicking on its icon. The object becomes highlighted and there appears a 'trace' of dots behind it. The trace shows where the object has been in the near past. The trace follows the object as it move.</p>
                        <p>To avoid highlighted objects from moving out of our view, we can use the system’s Autofocus mode. If you click the selected object once more, the object’s icon will change again and the map will center on the object and move automatically as the object moves. This can come in handy when you need to monitor an object over a long period of time. To cancel autofocus, simple click on outside of the object.</p>
                        `
                    }
                }
            ]
        },
        {
            title: {
                ru: 'Панель Объектов',
                en: 'Object Tool'
            },
            articles: [
                {
                    title: {
                        ru: 'Общие сведения',
                        en: 'Common information'
                    },
                    content: {
                        ru: `<p>Панель объектов находится в левом нижнем углу карты. Верхний ряд цифр на панели показывает количество людей, машин и механизмов, которые отслеживаются в текущий момент. Красные цифры в нижнем ряду, обозначают количество объектов, которые должны быть на карте (по расписанию), но их по каким-то причинам сейчас нет.</p>
                        <p>Посмотреть список нужных нам объектов и их свойства можно кликнув на соответствующую иконку (человека, машины или механизма) на панели объектов.</p>
                        <p>Для каждого объекта, мы можем посмотреть его свойства, текуще местоположение на карте, координаты и статус.</p>
                        `,
                        en: `<p>Lets use the Object Tool located at the lower left of the screen to have a closer look at our objects.</p>
                        <p>Here we see how many people, vehicles and assets we’re currently tracking. The red numbers below tell us how many objects need to be there, (by the shift roster, we\'ll talk about it later) but there's no current data from them on the server. Zeros means all good.</p>
                        <p>If we click on the human icon, we will see all the people there. For every person, we can see the Category, Type, Groups it belongs to, hours online (or offline), which tracking device is associated with him or her.</p>
                        <p>We can also see the person’s position on the map right from this tool, and this is real-time picture, it will move with object movements. We can switch to a different person and see their movements from here.</p>
                        <p>We can go back to Monitoring tool by clicking the link in the Tools Panel.</p>
                        <p>If we now click on the vehicle icon in the Object Tool, we will again go to the list, but now there will be only vehicles. Each of them also has a Category and Type, and we can see which groups they belong to. We can also monitor their movements from here, and monitor different equipment from the same place.</p>
                        <p>Here we can see Events and Incidents involving our vehicles. We will talk about Events and Incidents in a separate topic later.</p>
                        <p>And finally, we can we current status of this object: it’s coordinates, speed, direction, and so on.</p>
                        `
                    }
                }
            ]
        },
        {
            title: {
                ru: 'Правила для событий и зоны',
                en: 'Event rules and zones'
            },
            articles: [
                {
                    title: {
                        ru: 'Общие сведения',
                        en: 'Common information'
                    },
                    content: {
                        ru: '<iframe width="278" height="156" frameborder="0" allowfullscreen src="https://www.youtube.com/embed/xA2DoLQSarI?rel=0" style="margin: 0 auto;"></iframe>',
                        en: '<iframe width="278" height="156" frameborder="0" allowfullscreen src="https://www.youtube.com/embed/xA2DoLQSarI?rel=0" style="margin: 0 auto;"></iframe>'
                    }
                }
            ]
        }
    ];
    public searchControl = new FormControl();
    public filteredArticles: HelpArticle[];

    @Input() language: string;

    constructor(
        private sanitizer: DomSanitizer,
        private translate: TranslateService,
        public helpPanelService: IqsHelpPanelService
    ) {
        this.translate.setTranslation('ru', helpPanelTranslations.ru, true);
        this.translate.setTranslation('en', helpPanelTranslations.en, true);
        for (const tidx in this.topics) {
            if (!this.topics[tidx]) { continue; }
            for (const aidx in this.topics[tidx].articles) {
                if (!this.topics[tidx].articles[aidx]) { continue; }
                this.topics[tidx].articles[aidx].content.en = <string>this.sanitizer.bypassSecurityTrustHtml(this.topics[tidx].articles[aidx].content.en);
                this.topics[tidx].articles[aidx].content.ru = <string>this.sanitizer.bypassSecurityTrustHtml(this.topics[tidx].articles[aidx].content.ru);
            }
        }

        this.subs.add(this.helpPanelService.state$.subscribe(state => {
            if (state !== HelpPanelState.Search) { this.searchControl.setValue(''); }
        }));

        this.helpPanelService.currentTopic = null;
        this.helpPanelService.state = HelpPanelState.Topics;

        this.subs.add(this.searchControl.valueChanges.pipe(
            debounceTime(200),
            distinctUntilChanged()
        ).subscribe(search => {
            if (search && this.helpPanelService.state !== HelpPanelState.Search) {
                this.helpPanelService.state = HelpPanelState.Search;
            } else if (!search && this.helpPanelService.state === HelpPanelState.Search) {
                this.helpPanelService.state = HelpPanelState.Topics;
            }
            if (search) {
                const articles = [];
                for (const topic of this.topics) {
                    for (const article of topic.articles) {
                        if ((<any>article.content[this.language]).changingThisBreaksApplicationSecurity.match(search)) {
                            articles.push(article);
                        }
                    }
                }
                this.filteredArticles = articles;
            } else {
                this.filteredArticles = [];
            }
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public selectTopic(topic: HelpTopic) {
        this.helpPanelService.currentTopic = topic;
    }

    public selectArticle(article: HelpArticle) {
        this.helpPanelService.currentArticle = article;
    }

}
