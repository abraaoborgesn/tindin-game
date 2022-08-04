export class NotAuthorizedError extends Error {
  constructor() {
    super('Yuo don\'t have permission')
    this.name = 'NotAuthorizedError'
  }
}
