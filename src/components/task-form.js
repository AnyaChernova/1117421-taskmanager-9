import AbstractComponent from './absctract-component.js';
import {Position, KeyCode} from '../utils.js';

export default class TaskForm extends AbstractComponent {
  constructor({description, dueDate, tags, color, repeatingDays}) {
    super();
    this._description = description;
    this._dueDate = dueDate;
    this._tags = tags;
    this._color = color;
    this._repeatingDays = repeatingDays;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return `
      <article class="card card--edit card--${this._color} ${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]) ? `card--repeat` : ``}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--archive">
                archive
              </button>
              <button
                type="button"
                class="card__btn card__btn--favorites card__btn--disabled"
              >
                favorites
              </button>
            </div>
  
            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>
  
            <div class="card__textarea-wrap">
              <label>
                <textarea
                  class="card__text"
                  placeholder="Start typing your text here..."
                  name="text"
                >${this._description}</textarea>
              </label>
            </div>
  
            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <button class="card__date-deadline-toggle" type="button">
                    date: <span class="card__date-status">${this._dueDate ? `yes` : `no`}</span>
                  </button>
  
                  <fieldset class="card__date-deadline ${this._dueDate ? `` : `visually-hidden`}">
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder=""
                        name="date"
                        value="${this._dueDate ? `${new Date(this._dueDate).toDateString()}` : ``}"
                      />
                    </label>
                  </fieldset>
  
                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]) ? `yes` : `no`}</span>
                  </button>
  
                  <fieldset class="card__repeat-days ${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]) ? `` : `visually-hidden`}">
                    <div class="card__repeat-days-inner">
                    ${Object.keys(this._repeatingDays).map((day) => `
                      <input
                          class="visually-hidden card__repeat-day-input"
                          type="checkbox"
                          id="repeat-${day}-4"
                          name="repeat"
                          value="${day}"
                          ${this._repeatingDays[day] ? `checked` : ``}
                        />
                        <label class="card__repeat-day" for="repeat-${day}-4"
                          >${day}</label
                        >
                    `).join(``)}
                    </div>
                  </fieldset>
                </div>
  
                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                    ${Array.from(this._tags).map((tag) => `<span class="card__hashtag-inner">
                      <input
                        type="hidden"
                        name="hashtag"
                        value="${tag}"
                        class="card__hashtag-hidden-input"
                      />
                      <p class="card__hashtag-name">#${tag}</p>
                      <button type="button" class="card__hashtag-delete">delete</button></span>`).join(``)}
                  </div>
  
                  <label>
                    <input
                      type="text"
                      class="card__hashtag-input"
                      name="hashtag-input"
                      placeholder="Type new hashtag here"
                    />
                  </label>
                </div>
              </div>
  
              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  <input
                    type="radio"
                    id="color-black-4"
                    class="card__color-input card__color-input--black visually-hidden"
                    name="color"
                    value="black"
                  />
                  <label
                    for="color-black-4"
                    class="card__color card__color--black"
                    >black</label
                  >
                  <input
                    type="radio"
                    id="color-yellow-4"
                    class="card__color-input card__color-input--yellow visually-hidden"
                    name="color"
                    value="yellow"
                  />
                  <label
                    for="color-yellow-4"
                    class="card__color card__color--yellow"
                    >yellow</label
                  >
                  <input
                    type="radio"
                    id="color-blue-4"
                    class="card__color-input card__color-input--blue visually-hidden"
                    name="color"
                    value="blue"
                  />
                  <label
                    for="color-blue-4"
                    class="card__color card__color--blue"
                    >blue</label
                  >
                  <input
                    type="radio"
                    id="color-green-4"
                    class="card__color-input card__color-input--green visually-hidden"
                    name="color"
                    value="green"
                  />
                  <label
                    for="color-green-4"
                    class="card__color card__color--green"
                    >green</label
                  >
                  <input
                    type="radio"
                    id="color-pink-4"
                    class="card__color-input card__color-input--pink visually-hidden"
                    name="color"
                    value="pink"
                  />
                  <label
                    for="color-pink-4"
                    class="card__color card__color--pink"
                    >pink</label
                  >
                </div>
              </div>
            </div>
            <div class="card__status-btns">
              <button class="card__save" type="submit">save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>
    `.trim();
  }

  _setRepeatState() {
    this.getElement().classList.add(`card--repeat`);
    this.getElement().querySelector(`.card__repeat-days`).classList.remove(`visually-hidden`);
    this.getElement().querySelector(`.card__repeat-status`).innerHTML = `yes`;
  }

  _setNoRepeatState() {
    this.getElement().classList.remove(`card--repeat`);
    this.getElement().querySelector(`.card__repeat-days`).classList.add(`visually-hidden`);
    this.getElement().querySelector(`.card__repeat-status`).innerHTML = `no`;
    this.getElement().querySelectorAll(`input[name=repeat]`).forEach((element) => {
      element.checked = false;
    });
  }

  _setDeadlineState() {
    this.getElement().querySelector(`.card__date-deadline`).classList.remove(`visually-hidden`);
    this.getElement().querySelector(`.card__date-status`).innerHTML = `yes`;
  }

  _setNotDeadlineState() {
    this.getElement().querySelector(`.card__date-deadline`).classList.add(`visually-hidden`);
    this.getElement().querySelector(`.card__date-status`).innerHTML = `no`;
    this.getElement().querySelector(`input[name=date]`).value = ``;
  }

  _subscribeOnEvents() {
    this._onHashtagInput();
    this._onHashtagDelete();
    this._onColorSelect();
    this._onRepeatClick();
    this._onDateClick();
  }

  _onHashtagInput() {
    this.getElement()
    .querySelector(`.card__hashtag-input`).addEventListener(`keydown`, (evt) => {
      if (evt.key === KeyCode.ENTER) {
        evt.preventDefault();
        this.getElement().querySelector(`.card__hashtag-list`).insertAdjacentHTML(Position.BEFOREEND, `
        <span class="card__hashtag-inner">
          <input
            type="hidden"
            name="hashtag"
            value="${evt.target.value}"
            class="card__hashtag-hidden-input"
          />
          <p class="card__hashtag-name">
            #${evt.target.value}
          </p>
          <button type="button" class="card__hashtag-delete">
            delete
          </button>
        </span>`);
        evt.target.value = ``;
      }
    });
  }

  _onHashtagDelete() {
    this.getElement()
    .querySelectorAll(`.card__hashtag-delete`).forEach((element) => {
      element.addEventListener(`click`, (evt) => {
        evt.target.parentNode.remove();
      });
    });
  }

  _onColorSelect() {
    this.getElement()
    .querySelectorAll(`input[name='color']`).forEach((element) => {
      element.addEventListener(`click`, () => {
        const classNames = this.getElement().classList;
        classNames.forEach((name) => {
          if (/card--.*[^edit]/.test(name)) {
            this.getElement().classList.remove(name);
          }
        });
        this.getElement().classList.add(`card--${element.value}`);
      });
    });
  }

  _onRepeatClick() {
    this.getElement().querySelector(`.card__repeat-toggle`).addEventListener(`click`, () => {
      if (this.getElement().classList.contains(`card--repeat`)) {
        this._setNoRepeatState();
      } else {
        this._setRepeatState();
      }
    });
  }

  _onDateClick() {
    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      if (this.getElement().querySelector(`.card__date-deadline`).classList.contains(`visually-hidden`)) {
        this._setDeadlineState();
      } else {
        this._setNotDeadlineState();
      }
    });
  }

}
