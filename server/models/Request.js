export default class Request {
  constructor(type, item, model, detail, owner) {
    this.type = type;
    this.item = item;
    this.model = model;
    this.detail = detail;
    this.status = 'in-review';
    this.owner = owner;
  }
}
