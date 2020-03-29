import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import seedrandom from 'seedrandom';

const categories: Category[] = [
    { from: 'klein', to: 'groß' },
    { from: 'mild', to: 'würzig' },
    { from: 'Groschenroman', to: 'Weltliteratur' },
    { from: 'untalentiert', to: 'talentiert' },
    { from: 'Für Kinder', to: 'Für Erwachsene' },
    { from: 'Morgens', to: 'Abends' },
    { from: 'zwanglos', to: 'förmlich' },
    { from: 'häufig', to: 'selten' },
    { from: 'nah', to: 'fern' },
    { from: 'stark', to: 'schwach' },
    { from: 'Top', to: 'Flop' },
    { from: 'Nord', to: 'Süd' },
    { from: 'Ost', to: 'West' },
    { from: 'lecker', to: 'ungenießbar' },
    { from: 'stinkt', to: 'riecht gut' },
    { from: 'Raubtier', to: 'Kuscheltier' },
    { from: 'Dystopie', to: 'Utopie' },
    { from: 'Beliebter Pizzabelag', to: 'Unbeliebter Pizzabelag' },
    { from: 'hoch', to: 'tief' },
    { from: 'weltoffen', to: 'engstirnig' },
    { from: 'gut', to: 'böse' },
    { from: 'Diktatur', to: 'Demokratie' },
    { from: 'heiß', to: 'kalt' },
    { from: 'gute Angewohnheit', to: 'schlechte Angewohnheit' },
    { from: 'historisch wichtig', to: 'historisch unwichtig' },
    { from: 'attraktiv', to: 'unattraktiv' },
    { from: 'überbewertet', to: 'unterbewertet' },
    { from: 'verboten', to: 'erwünscht' },
    { from: 'nass', to: 'trocken' },
    { from: 'glatt', to: 'rau' },
    { from: 'populär', to: 'unpopulär' },
    { from: 'weich', to: 'hart' },
    { from: 'dumm', to: 'brilliant' },
    { from: 'billig', to: 'teuer' },
    { from: 'benötigt Können', to: 'benötigt Glück' },
    { from: 'oft benutzter Buchstabe', to: 'selten benutzter Buchstabe' },
    { from: 'geteilt', to: 'ganz' },
    { from: 'nützliche Erfindung', to: 'unnütze Erfindung' },
    { from: 'flexibel', to: 'unflexibel' },
    { from: 'rund', to: 'spitz' },
    { from: 'hohe Qualität', to: 'niedrige Qualität' },
    { from: 'hell', to: 'dunkel' },
    { from: 'gut gemacht', to: 'schlecht gemacht' },
    { from: 'lauter Ort', to: 'leiser Ort' },
    { from: 'brauchen', to: 'wollen' },
    { from: 'schlechte Superkraft', to: 'geniale Superkraft' },
    { from: 'temporär', to: 'permanent' },
    { from: 'matt', to: 'glänzend' },
    { from: 'sauber', to: 'dreckig' },
    { from: 'durchsichtig', to: 'undurchsichtig' },
    { from: 'reich', to: 'arm' },
    { from: 'knapp', to: 'ausreichend' },
    { from: 'Dorf', to: 'Weltstadt' },
    { from: 'nett', to: 'gemein' },
    { from: 'friedlich', to: 'gewaltsam' },
    { from: 'unterlegen', to: 'überlegen' },
    { from: 'immer leer', to: 'immer voll' },
    { from: 'großes Land', to: 'kleines Land' },
    { from: 'altmodisch', to: 'modern' },
    { from: 'regional', to: 'global' },
    { from: 'verantwortungsvoll', to: 'leichtsinnig' },
    { from: 'loyal', to: 'untreu' },
    { from: 'Kavaliersdelikt', to: 'Straftat' },
    { from: 'schnell', to: 'langsam' },
    { from: '80er', to: '90er' },
    { from: 'normaler Besitzgegenstand', to: 'ungewöhnlicher Besitzgegenstand' },
    { from: 'beliebter Drink', to: 'seltener Drink' },
    { from: 'dick', to: 'dünn' },
    { from: 'monoton', to: 'abwechslungsreich' },
    { from: 'heruntergekommen', to: 'in Schuss' }
];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    @ViewChild('form')
    form: NgForm;

    @ViewChild('scale')
    scaleRef: ElementRef<HTMLDivElement>;

    characters = '123456789abcdefghijkmnpqrstuvwxyz';

    enterCode = false;

    code = '';

    indicator = 50;

    answer = 0;

    hideIndicator = true;

    round = 0;

    rounds = 7;

    points = 0;

    category: Category;

    categories = categories.slice();

    markers = Array.from(new Array(21).keys()).map(index => index * 5);

    private get scaleRect() {
        return this.scaleRef.nativeElement.getBoundingClientRect();
    }

    private drag = (event: PointerEvent) => this.updateAnswer(event.pageX);

    private endDrag = () => {
        document.removeEventListener('pointermove', this.drag);
        document.removeEventListener('pointerup', this.endDrag);
    }

    newGame() {
        const random = seedrandom();

        for (let i = 0; i < 6; i++) {
            this.code += this.characters[Math.floor(random() * this.characters.length)];
        }

        this.nextRound();
    }

    setCode() {
        this.code = this.form.value.code;
        this.enterCode = false;

        this.nextRound();
    }

    nextRound() {
        const random = new seedrandom(`${ this.code }.${ this.round }`);

        this.round++;
        this.hideIndicator = true;
        this.indicator = random() * 100;
        this.category = this.categories.splice(Math.floor(random() * this.categories.length), 1)[0];

        if (!this.categories.length) {
            this.categories = categories.slice();
        }
    }

    startDrag(event: PointerEvent) {
        document.addEventListener('pointermove', this.drag);
        document.addEventListener('pointerup', this.endDrag);

        this.updateAnswer(event.pageX);
    }

    toggle() {
        this.hideIndicator = !this.hideIndicator;
    }

    endGame() {
        this.code = '';
        this.round = 0;
        this.rounds = 7;
        this.points = 0;
    }

    private updateAnswer(pageX: number) {
        const scaleRect = this.scaleRect;

        this.answer = Math.min(
            Math.max(
                pageX - scaleRect.left,
                0
            ),
            scaleRect.width
        );
    }

}

interface Category {

    from: string;

    to: string;

}
