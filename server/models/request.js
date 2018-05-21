export default class Request {
  constructor(id, type, item, model, detail) {
    this.id = id;
    this.type = type;
    this.item = item;
    this.model = model;
    this.detail = detail;
  }
}
