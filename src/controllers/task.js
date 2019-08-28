import TaskForm from '../components/task-form.js';
import Task from '../components/task.js';
import {Position, KeyCode, render} from '../utils.js';

export default class TaskController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._taskView = new Task(data);
    this._taskEdit = new TaskForm(data);
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;

    this.create();
  }

  create() {
    const onEscKeyDown = (evt) => {
      if (evt.key === KeyCode.ESCAPE || evt.key === KeyCode.ESC) {
        this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._taskView.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._container.getElement().replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskView.getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, () => {
        this._addToArchive();
      });

    this._taskView.getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, () => {
        this._addToFavorite();
      });

    this._taskEdit.getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, () => {
        this._addToArchive();
      });

    this._taskEdit.getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, () => {
        this._addToFavorite();
      });

    this._taskEdit.getElement().querySelector(`#color-${this._data.color}-4`).checked = true;

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));
        const entry = {
          description: formData.get(`text`),
          color: formData.get(`color`),
          tags: new Set(formData.getAll(`hashtag`)),
          dueDate: formData.get(`date`) ? new Date(formData.get(`date`)) : ``,
          repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
            acc[it] = true;
            return acc;
          }, {
            'mo': false,
            'tu': false,
            'we': false,
            'th': false,
            'fr': false,
            'sa': false,
            'su': false,
          })
        };
        this._onDataChange(entry, this._data);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._container.getElement(), this._taskView.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._taskEdit.getElement())) {
      this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }

  _addToArchive() {
    const newData = this._data;
    if (newData.isArchive) {
      newData.isArchive = false;
    } else {
      newData.isArchive = true;
    }
    this._onDataChange(newData, this._data);
  }

  _addToFavorite() {
    const newData = this._data;
    if (newData.isFavorite) {
      newData.isFavorite = false;
    } else {
      newData.isFavorite = true;
    }
    this._onDataChange(newData, this._data);
  }
}