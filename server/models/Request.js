export default class Request {
  constructor(type, item, model, detail, status, owner) {
    this.type = type;
    this.item = item;
    this.model = model;
    this.detail = detail;
    this.status = status;
    this.owner = owner;
  }
}
