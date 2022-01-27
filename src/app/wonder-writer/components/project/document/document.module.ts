import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocumentComponent} from './document.component';
import {ManuscriptComponent} from './manuscript/manuscript.component';
import {CharacterComponent} from './character/character.component';
import {PlaceComponent} from './place/place.component';
import {EpisodeComponent} from './episode/episode.component';
import {DocumentContainer} from './document-container/document-container';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {DocumentHeaderComponent} from './document-header/document-header.component';
import {DocumentHeaderActionComponent} from './document-header-action/document-header-action.component';
import {SplitViewDocumentContainer} from './document-container/split-view-document-container';
import {TextEditorComponent} from './text-editor/text-editor.component';
import {RelationViewComponent} from './relation-view/relation-view.component';
import {FormsModule} from '@angular/forms';
import {RelationViewActionsComponent} from './relation-view-actions/relation-view-actions.component';
import {IconButtonModule} from '@wonder-writer/components/common/icon-button/icon-button.module';
import {AutoPositionerModule} from '@tk-ui/components/auto-positioner/auto-positioner.module';
import {AutoCloserModule} from '@tk-ui/components/auto-closer/auto-closer.module';
import {RelationItemComponent} from './relation-item/relation-item.component';
import {RelationModalModule} from '@wonder-writer/components/project/relation-modal/relation-modal.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';


@NgModule({
  declarations: [
    DocumentComponent,
    DocumentContainer,
    SplitViewDocumentContainer,
    ManuscriptComponent,
    CharacterComponent,
    PlaceComponent,
    EpisodeComponent,
    DocumentHeaderComponent,
    DocumentHeaderActionComponent,
    TextEditorComponent,
    RelationViewComponent,
    RelationViewActionsComponent,
    RelationItemComponent
  ],
  exports: [
    DocumentComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    FormsModule,
    IconButtonModule,
    AutoPositionerModule,
    AutoCloserModule,
    RelationModalModule,
    FlatButtonModule,
  ]
})
export class DocumentModule {
}
