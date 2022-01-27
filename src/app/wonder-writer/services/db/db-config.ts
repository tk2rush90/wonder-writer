import {IndexedDbConfig} from '@tk-ui/utils/indexed-db.util';
import {DbService} from './db.service';
import {ProjectStoreService} from './project-store.service';
import {HierarchyStoreService} from './hierarchy-store.service';
import {ManuscriptStoreService} from './manuscript-store.service';
import {CharacterStoreService} from './character-store.service';
import {PlaceStoreService} from './place-store.service';
import {EpisodeStoreService} from './episode-store.service';
import {CharacterByCharacterRelationStoreService} from './character-by-character-relation-store.service';
import {CharacterByPlaceRelationStoreService} from './character-by-place-relation-store.service';
import {EpisodeByCharacterRelationStoreService} from './episode-by-character-relation-store.service';
import {EpisodeByPlaceRelationStoreService} from './episode-by-place-relation-store.service';
import {ProjectSettingsStoreService} from '@wonder-writer/services/db/project-settings-store.service';

export const DB_CONFIG: IndexedDbConfig = {
  name: DbService.dbName,
  version: 1,
  stores: [
    {
      name: ProjectStoreService.storeName,
      keyPath: 'id',
    },
    {
      name: HierarchyStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          // Index to search project root hierarchy.
          // Set `projectId` as project id, `parentId` as undefined to get root hierarchies.
          name: 'projectId, parentId',
          keyPath: ['projectId', 'parentId'],
        },
        {
          // Index to search all hierarchy for specific type in project by project id
          name: 'projectId, type',
          keyPath: ['projectId', 'type'],
        },
        {
          // Index to search child hierarchies by `parentId`.
          name: 'parentId',
          keyPath: 'parentId',
        },
        {
          name: 'projectId',
          keyPath: 'projectId',
        },
      ],
    },
    {
      name: ManuscriptStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          // Index to search by hierarchy id.
          name: 'hierarchyId',
          keyPath: 'hierarchyId',
        },
      ],
    },
    {
      name: CharacterStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          // Index to search by hierarchy id.
          name: 'hierarchyId',
          keyPath: 'hierarchyId',
        },
      ],
    },
    {
      name: PlaceStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          // Index to search by hierarchy id.
          name: 'hierarchyId',
          keyPath: 'hierarchyId',
        },
      ],
    },
    {
      name: EpisodeStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          // Index to search by hierarchy id.
          name: 'hierarchyId',
          keyPath: 'hierarchyId',
        },
      ],
    },
    {
      name: CharacterByCharacterRelationStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          name: 'fromCharacterId',
          keyPath: 'fromCharacterId',
        },
        {
          name: 'toCharacterId',
          keyPath: 'toCharacterId',
        },
      ],
    },
    {
      name: CharacterByPlaceRelationStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          name: 'characterId',
          keyPath: 'characterId',
        },
        {
          name: 'placeId',
          keyPath: 'placeId',
        },
      ],
    },
    {
      name: EpisodeByCharacterRelationStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          name: 'episodeId',
          keyPath: 'episodeId',
        },
        {
          name: 'characterId',
          keyPath: 'characterId',
        },
      ],
    },
    {
      name: EpisodeByPlaceRelationStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          name: 'episodeId',
          keyPath: 'episodeId',
        },
        {
          name: 'placeId',
          keyPath: 'placeId',
        },
      ],
    },
    {
      name: ProjectSettingsStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          name: 'projectId',
          keyPath: 'projectId',
        },
      ],
    }
  ],
};
