function configObjectGroupsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('object_groups', '/api/v1/organizations/:org_id/object_groups/:group_id',
        { group_id: '@group_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });
}

// this.registerRoute('get', '/object_groups', objectGroups.getGroupsOperation());
// this.registerRoute('get', '/object_groups/:group_id', objectGroups.getGroupOperation());
// this.registerRoute('post', '/object_groups', objectGroups.createGroupOperation());
// this.registerRoute('put', '/object_groups/:group_id', objectGroups.updateGroupOperation());
// this.registerRoute('del', '/object_groups/:group_id', objectGroups.deleteGroupOperation());

angular
    .module('iqsObjectGroups.Resource', ['pipCommonRest'])
    .config(configObjectGroupsResources);


