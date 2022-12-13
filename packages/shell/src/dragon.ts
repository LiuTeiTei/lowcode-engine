import {
  Dragon as InnerDragon,
  LocateEvent as InnerLocateEvent,
} from '@alilc/lowcode-designer';
import { dragonSymbol } from './symbols';
import LocateEvent from './locate-event';
import DragObject from './drag-object';
import { globalContext } from '@alilc/lowcode-editor-core';
import {
  IPublicModelDragon,
  IPublicModelLocateEvent,
  IPublicModelDragObject,
  DragObject as InnerDragObject,
  DragNodeDataObject,
} from '@alilc/lowcode-types';

export const innerDragonSymbol = Symbol('innerDragonSymbol');


export default class Dragon implements IPublicModelDragon {
  constructor(dragon: InnerDragon) {
    this[innerDragonSymbol] = dragon;
  }

  private readonly [innerDragonSymbol]: InnerDragon;

  get [dragonSymbol](): any {
    const workSpace = globalContext.get('workSpace');
    let editor = globalContext.get('editor');

    if (workSpace.isActive) {
      editor = workSpace.window.editor;
    }

    const designer = editor.get('designer');
    return designer.dragon;
  }

  static create(dragon: InnerDragon | null): IPublicModelDragon | null {
    if (!dragon) {
      return null;
    }
    return new Dragon(dragon);
  }

  /**
   * is dragging or not
   */
  get dragging(): boolean {
    return this[dragonSymbol].dragging;
  }

  /**
   * 绑定 dragstart 事件
   * @param func
   * @returns
   */
  onDragstart(func: (e: IPublicModelLocateEvent) => any): () => void {
    return this[dragonSymbol].onDragstart((e: InnerLocateEvent) => func(LocateEvent.create(e)!));
  }

  /**
   * 绑定 drag 事件
   * @param func
   * @returns
   */
  onDrag(func: (e: IPublicModelLocateEvent) => any): () => void {
    return this[dragonSymbol].onDrag((e: InnerLocateEvent) => func(LocateEvent.create(e)!));
  }

  /**
   * 绑定 dragend 事件
   * @param func
   * @returns
   */
  onDragend(func: (o: { dragObject: IPublicModelDragObject; copy?: boolean }) => any): () => void {
    return this[dragonSymbol].onDragend(
      (o: { dragObject: InnerDragObject; copy?: boolean }) => func({
        dragObject: DragObject.create(o.dragObject)!,
        copy: o.copy,
      }),
    );
  }

  /**
   * 设置拖拽监听的区域 shell，以及自定义拖拽转换函数 boost
   * @param shell 拖拽监听的区域
   * @param boost 拖拽转换函数
   */
  from(shell: Element, boost: (e: MouseEvent) => DragNodeDataObject | null): any {
    return this[dragonSymbol].from(shell, boost);
  }
}
