import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HierarchiesComponent} from './hierarchies.component';
import {HierarchyItemComponent} from './hierarchy-item/hierarchy-item.component';
import {CurrentHierarchyComponent} from './current-hierarchy/current-hierarchy.component';
import {IconButtonModule} from '../../common/icon-button/icon-button.module';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {HierarchyContextMenuComponent} from './hierarchy-context-menu/hierarchy-context-menu.component';
import {CreateDirectoryModalModule} from '../create-directory-modal/create-directory-modal.module';
import {DeleteDirectoryModalModule} from '../delete-directory-modal/delete-directory-modal.module';
import {CreateHierarchyModalModule} from '../create-hierarchy-modal/create-hierarchy-modal.module';
import {DeleteHierarchyModalModule} from '../delete-hierarchy-modal/delete-hierarchy-modal.module';
import {EditHierarchyModalModule} from '../edit-hierarchy-modal/edit-hierarchy-modal.module';
import {DraggingHierarchyComponent} from './dragging-hierarchy/dragging-hierarchy.component';
import {HierarchyDropzoneComponent} from './hierarchy-dropzone/hierarchy-dropzone.component';
import {DroppableItem} from './droppable/droppable-item';
import {ClearHierarchyModalModule} from '../clear-hierarchy-modal/clear-hierarchy-modal.module';


@NgModule({
  declarations: [
    HierarchiesComponent,
    HierarchyItemComponent,
    CurrentHierarchyComponent,
    HierarchyContextMenuComponent,
    DraggingHierarchyComponent,
    HierarchyDropzoneComponent,
    DroppableItem,
  ],
  exports: [
    HierarchiesComponent
  ],
  imports: [
    CommonModule,
    IconButtonModule,
    IconModule,
    CreateDirectoryModalModule,
    DeleteDirectoryModalModule,
    CreateHierarchyModalModule,
    DeleteHierarchyModalModule,
    EditHierarchyModalModule,
    ClearHierarchyModalModule,
  ]
})
export class HierarchiesModule {
}
