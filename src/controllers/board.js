import Board from '../components/board.js';
import TaskList from '../components/task-list.js';
import Sorting from '../components/sorting.js';
import LoadMore from '../components/load-more.js';
import TaskController from '../controllers/task.js';
import {Position, Mode, render, unrender} from '../utils.js';
const TaskControllerMode = Mode;

export default class BoardController {
  constructor(container, tasks) {
    this._TASK_COUNT = 8;
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._taskList = new TaskList();
    this._sorting = new Sorting();
    this._loadBtn = new LoadMore();
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    const isTasksExist = this._tasks.length && !this._tasks.filter(({
      isArchive
    }) => isArchive).length;

    if (isTasksExist) {
      this._renderBoard(this._tasks, this._TASK_COUNT);
    } else {
      this._renderEmptyMessage();
    }
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._board.getElement().classList.remove(`visually-hidden`);
  }

  createTask() {
    const defaultTask = {
      description: ``,
      dueDate: new Date(),
      tags: new Set(),
      color: ``,
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      },
      isFavorite: false,
      isArchive: false,
    };

    this._renderTask(defaultTask, TaskControllerMode.ADDING);
  }

  _renderTasks(taskItems, from, to) {
    taskItems.slice(from, to).forEach((task) => this._renderTask(task, TaskControllerMode.DEFAULT));
  }

  _renderTask(taskMock, mode) {
    const taskController = new TaskController(this._taskList, taskMock, mode, this._onDataChange, this._onChangeView);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onDataChange(newData, oldData) {
    const index = this._tasks.findIndex((task) => task === oldData);
    let showedTasks = this._TASK_COUNT;
    if (newData === null) {
      this._tasks = [...this._tasks.slice(0, index), ...this._tasks.slice(index + 1)];
      showedTasks = Math.min(this._TASK_COUNT, this._tasks.length);
    } else if (oldData === null) {
      this._tasks = [newData, ...this._tasks];
    } else {
      this._tasks[index] = newData;
    }

    this._renderBoard(this._tasks, showedTasks);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _renderBoard(tasks, count) {
    this._clearBoard();

    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._sorting.getElement(), Position.AFTERBEGIN);
    this._renderTasks(tasks, 0, count);

    if (tasks.length > count) {
      this._renderLoadBtn(tasks, count);
    }

    this._sorting.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderLoadBtn(tasks, count) {
    let renderedTasks = count;
    render(this._board.getElement(), this._loadBtn.getElement(), Position.BEFOREEND);
    this._loadBtn.getElement().addEventListener(`click`, () => {
      this._renderTasks(tasks, renderedTasks, renderedTasks + count);
      renderedTasks = count + renderedTasks;
      if (renderedTasks >= tasks.length) {
        this._loadBtn.getElement().style.opacity = `0`;
      }
    });
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    this._clearBoard();

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._renderBoard(sortedByDateUpTasks, this._TASK_COUNT);
        break;
      case `date-down`:
        const sortedByDateDownTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._renderBoard(sortedByDateDownTasks, this._TASK_COUNT);
        break;
      case `default`:
        this._renderBoard(this._tasks, this._TASK_COUNT);
        break;
    }
  }

  _renderEmptyMessage() {
    this._board.getElement().innerHTML = `
      <p class="board__no-tasks">
        Congratulations, all tasks were completed! To create a new click on
        «add new task» button.
      </p>`;
  }

  _clearBoard() {
    unrender(this._taskList.getElement());
    unrender(this._loadBtn.getElement());
    this._taskList.removeElement();
    this._loadBtn.removeElement();
  }
}
