export interface IFactory<T> {
    create(arg: any): T
}