import { SelectionModel, ArrayDataSource } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { map } from 'rxjs/operators';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface FoodNode {
  name: string;
  isChecked?: boolean;
  inputType?: string;
  children?: FoodNode[];
}

interface Options {
  dataSource?: FoodNode[];
  node?: FoodNode;
  searchTerms?: string;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Standard Signature',
    isChecked: false,
    inputType: 'checkbox',
  },
  {
    name: 'DC Based Signature',
    isChecked: false,
    children: [
      {
        name: 'CDS Based Signature',
        isChecked: true,
        inputType: 'checkbox',
      },
      {
        name: 'NID Sign',
        isChecked: false,
        children: [
          { name: 'A Card', isChecked: false, inputType: 'radio' },
          { name: 'S Pass', isChecked: false, inputType: 'radio' },
          { name: 'UAE Pass', isChecked: false, inputType: 'radio' },
        ],
      },
      {
        name: 'USB_Smart_Card',
        isChecked: true,
        inputType: 'checkbox',
      },
    ],
  },
];

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'cdk-tree-nested-example',
  templateUrl: 'cdk-tree-nested-example.html',
  styleUrls: ['cdk-tree-nested-example.css'],
})
export class CdkTreeNestedExample {
  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  dataSource = new ArrayDataSource(TREE_DATA);
  payloadArray: string[] = [];

  /** The selection for checklist */
  checklistSelection = new SelectionModel<FoodNode>(true /* multiple */);

  hasChild = (_: number, node: FoodNode) =>
    !!node.children && node.children.length > 0;

  onSelectionChild(node: FoodNode) {
    console.log(node);
    if (this.checklistSelection.isSelected(node)) {
      if (this.payloadArray.length > 0) {
        const nodeIndex: number = this.payloadArray.findIndex(
          (nodeName) => nodeName == node.name
        );
        this.payloadArray.splice(nodeIndex, 1);
      }
      node.isChecked = false;
      this.checklistSelection.deselect(node);

      // this.payloadArray.splice()
    } else {
      node.isChecked = true;
      this.checklistSelection.select(node);
      this.payloadArray.push(node.name);
    }
    // this.checklistSelection.toggle(node);
    // this.payloadArray.push(node.name);
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: FoodNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FoodNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: FoodNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  onNodeClicked(node: any) {
    // const dataSource = this.dataSource[node.index];
    // this.findNode({ dataSource: dataSource, node: node });
  }

  // findNode(options: Options) {
  //   const ds = options.dataSource;

  //   if (ds && ds.children) {
  //     ds.children.forEach((nodeItem: FoodNode) => {
  //       if (nodeItem === options.node) {
  //         this.collapseSiblings(ds, options.node);
  //       } else {
  //         if (
  //           nodeItem.children &&
  //           nodeItem.children.length > 0 &&
  //           this.selectedNodeIndex
  //         ) {
  //           this.findNode({
  //             dataSource: nodeItem,
  //             node: options.node,
  //           });
  //         }
  //       }
  //     });
  //   }
  // }
}
